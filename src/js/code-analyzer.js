import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

//Helpers
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function copy(o) {
    let output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === 'object') ? copy(v) : v;
    }
    return output;
}

const makeEsp = (code) => esprima.parseScript(code, {loc: true});

const changeParams = (params) => {
    for(let key in params)
        params[key] = {'type': 'Literal', 'value': params[key], 'raw': params[key]};
};

const findIndex = (body) => {
    for(let i = 0; i < body.length; i++)
        if(body[i].type === 'FunctionDeclaration')
            return i;
    return -1;
};

const makeLit = (val, raw) => {
    return {'type': 'Literal', 'value': val, 'raw': raw};
};

const makeBlock = (body, gen, exp, sync, color) => {
    return {
        type: 'BlockStatement',
        body: body,
        generator: gen, expression: exp,
        async: sync,
        color: color
    };
};

const makeNode = (num, label, type, color) => {
    return {id: num, label: label, shape: type, size : 30, color: {background: color, border: 'black'}};
};

const subParse = (rec, env) => Handlers[rec.type](rec, env);

const subRows = (list, env) =>{
    for(let i=0; i < list.length; i++)
        subParse(list[i], env);

};

const paramsHelper = (list, env) => list.map((item) => {env[item.name] = {'type': 'Identifier', 'name': item.name};});

const subBinary = (rec, env) => {
    rec.left = valSub(rec.left, env);
    rec.right = valSub(rec.right, env);
    return ((rec.left).type === 'Literal' && !isNaN(rec.left.value) &&
        (rec.right).type === 'Literal' && !isNaN((rec.right).value))
        ? makeLit(eval(escodegen.generate(rec)),'evaluated')
        : rec;
};

const valSub = (rec, env) => rec.type === 'BinaryExpression' ? subBinary(rec, env) : rec.type === 'Identifier' ? env[rec.name] : rec;

//sub handlers
const PrgF = (rec, env)=> subRows(rec.body, env);

const varDeclF = (rec, env) => {
    if(rec.init == null)
        env[rec.id.name] = {'type': 'Identifier', 'name': rec.id.name};
    else{
        env[rec.id.name] = valSub(rec.init, env);
        rec.init = valSub(rec.init, env);
    }
};

const varDeclerationF = (rec, env) => subRows(rec.declarations, env);

const funcDeclF = (rec, env) => {
    paramsHelper(rec.params, env);
    subParse(rec.body, env);
};

const blkSttF = (rec, env) => subRows(rec.body, env);

const ifSttF = (rec, env) =>{
    rec.test = valSub(rec.test, env);
    subParse(rec.consequent, copy(env));
    if(rec.alternate !== null)
        try {subParse(rec.alternate, copy(env));}catch (e) { e.toString();}
};

const retSttF = (rec, env) => rec.argument = valSub(rec.argument, env);

const expSttF = (rec, env) => subParse(rec.expression, env);

const assExpF = (rec, env) =>{
    rec.right = valSub(rec.right, env);
    env[rec.left.name] = rec.right;
};

const seqExpF = (rec, env) => rec.expressions.map(x => Handlers[x.type](x, env));

const whileSttF = (rec, env) =>{
    valSub(rec.test, env);
    subParse(rec.body, copy(env));
};

const updateExpF = (rec) => {
    let locals = {};
    if (locals[rec.argument.name] === undefined)
        return rec;
    return null;
};

let Handlers = {
    'Program': PrgF,
    'VariableDeclarator' : varDeclF,
    'VariableDeclaration' : varDeclerationF,
    'FunctionDeclaration' : funcDeclF,
    'BlockStatement' : blkSttF,
    'IfStatement' : ifSttF,
    'ReturnStatement' : retSttF,
    'ExpressionStatement' : expSttF,
    'AssignmentExpression': assExpF,
    'SequenceExpression' : seqExpF,
    'WhileStatement' : whileSttF,
    'UpdateExpression' : updateExpF
};

const parseCode = (codeToParse, params) =>{
    let toGraph = {nodes: [], always: [], dit: [], dif: []};
    addNodes(null, addColors(codeToParse, params)[0].body[0].body.body, toGraph,0, 1);
    return toGraph;
};

const addNodes = (prev, body, toGraph, index, nodeNum) => {
    if(index === body.length) return [prev.id, nodeNum];
    let type = body[index].type;
    return type in specialHandlers ?
        specialHandlers[type](prev, body, index, nodeNum, toGraph) :
        putDeclAss(prev, body, toGraph, index, nodeNum);
};

const declAssHelper = (body, index) => {
    let toAdd = [];
    for(index; index < body.length; index++){
        let type = body[index].type;
        if(type !== 'ReturnStatement' && type !== 'IfStatement' && type !== 'WhileStatement') toAdd.push(body[index]);
        else break;
    }
    return [makeBlock(toAdd, false, false, false, toAdd[0].color), index];
};

const putDeclAss = (prev, body, toGraph, index, nodeNum) => {
    let declAss = declAssHelper(body, index);
    index = declAss[1];
    let curNode = createNode(nodeNum, declAss[0], 'box', declAss[0].color);
    nodeNum++;
    toGraph.nodes.push(curNode);
    if(prev !== null)
        toGraph.always.push([prev.id, curNode.id]);
    return addNodes(curNode, body, toGraph, index, nodeNum);
};

const createNode = (num, toPut, type, color) => {
    if(color === undefined) color = 'lightgrey';
    let label = toPut;
    if(toPut.type !== undefined) label = getLabel(escodegen.generate(toPut));
    if(num > 0) label = num + ': ' + label;
    return makeNode(num, label, type,color);
};

const getLabel = (label) => label.replaceAll('\n', '').replaceAll('{', '').replaceAll('}', '').replaceAll('let', '').replaceAll(';', '');

function whileSpecial(prev, body, index, nodeNUm, curr){
    let empty = createNode(nodeNUm, 'NULL', 'box', 'limegreen');
    curr.nodes.push(empty); nodeNUm++;
    let curStatement = body[index]; index++;
    let test = createNode(nodeNUm, curStatement.test, 'diamond', curStatement.color);
    curr.nodes.push(test);nodeNUm++;
    let whBody = createNode(nodeNUm, curStatement.body, 'box', curStatement.body.color);
    curr.nodes.push(whBody);nodeNUm++;
    curr.always.push([prev.id, empty.id]);curr.always.push([empty.id, test.id]);curr.always.push([whBody.id, empty.id]);
    curr.dit.push([test.id, whBody.id]);curr.dif.push([test.id, nodeNUm]);
    return addNodes(null, body, curr, index, nodeNUm);
}

const ifSpecial = (prev, body, index, nodeNum, toGraph) => {
    let stt = body[index++];
    let tmp= -nodeNum;
    let emptyNode = createNode(tmp, '', 'ellipse', stt.test.color);
    toGraph.nodes.push(emptyNode);
    let retAdd = addIf(stt, emptyNode, nodeNum, toGraph);
    toGraph = retAdd[0];
    nodeNum = retAdd[1];
    toGraph.always.push([prev.id, retAdd[2].id]);
    if(stt.alternate === null){
        toGraph.dif.push([retAdd[2].id, tmp]);
        return addNodes(emptyNode, body, toGraph, index, nodeNum);
    }
    return altHandle(retAdd[2], emptyNode, stt.alternate, body, index, nodeNum, toGraph);
};

const addIf = (stt, empty, nodeNum, toGraph) => {
    let test = createNode(nodeNum, stt.test, 'diamond', stt.test.color);
    nodeNum++;
    toGraph.nodes.push(test);
    toGraph.dit.push([test.id, nodeNum]);
    let retAdd = addNodes(null, stt.consequent.body, toGraph, 0,nodeNum);
    nodeNum = retAdd[1];
    toGraph.always.push([retAdd[0], empty.id]);
    return [toGraph, nodeNum, test];
};

const inner = (test, empty, alt, body, index, nodeNum, toGraph) => {
    let retAdd = addIf(alt, empty, nodeNum, toGraph);
    toGraph = retAdd[0];
    nodeNum = retAdd[1];
    toGraph.dif.push([test.id, retAdd[2].id]);
    if(alt.alternate !== null) return  altHandle(retAdd[2], empty, alt.alternate, body, index, nodeNum, toGraph);
    toGraph.dif.push([retAdd[2].id, empty.id]);
    return addNodes(empty, body, toGraph, index, nodeNum);
};

const altHandle = (test, empty, alt, body, index, nodeNum, toGraph) => {
    return (alt.type === 'IfStatement') ?
        inner(test, empty, alt, body, index, nodeNum, toGraph)
        : normAlt(test, empty, alt, body, index, nodeNum, toGraph);
};

const normAlt = (test, empty, alt, body, index, nodeNum, toGraph) => {
    toGraph.dif.push([test.id, nodeNum]);
    let retAdd = addNodes(null, alt.body, toGraph, 0, nodeNum);
    nodeNum = retAdd[1];
    toGraph.always.push([retAdd[0], empty.id]);
    return addNodes(empty, body, toGraph, index, nodeNum);
};

const retSpecial = (prev, body, index, nodeNum, toGraph) => {
    let returnNode = createNode(nodeNum, body[index], 'box', body[index].color);
    toGraph.nodes.push(returnNode);
    if(prev !== null) toGraph.always.push([prev.id, returnNode.id]);
    return [nodeNum-1, nodeNum];
};

let specialHandlers = {
    'IfStatement' : ifSpecial,
    'ReturnStatement' : retSpecial,
    'WhileStatement' : whileSpecial
};

const addColors = (rec, params) => {
    changeParams(params);
    let before = makeEsp(rec);
    let after = makeEsp(rec);
    let index = findIndex(after.body);
    if(index === -1) return [before, []];
    let stt = after.body[index];
    stt = makeEsp(escodegen.generate(stt)).body[0];
    before.body[index] = makeEsp(escodegen.generate(before.body[index])).body[0];
    let functionStatementCopy = copy(stt);
    subParse(functionStatementCopy.body, params);
    let coloredRows = [[],[]];
    makeColorBody(functionStatementCopy.body.body, before.body[index].body.body, coloredRows);
    coloredRows[0].map(x => x += index);
    coloredRows[1].map(x => x += index);
    return [before, coloredRows];
};

const whileBody = (after, before, ColoredRow) =>{
    before.body.color = 'limegreen';
    ColoredRow[0].push(before.loc.start.line);
    makeColorBody(after.body.body, before.body.body, ColoredRow);
};

const colorConsequent = (after, before, ColoredRow) =>{
    before.consequent.color = 'limegreen';
    ColoredRow[0].push(before.loc.start.line);
    makeColorBody(after.consequent.body, before.consequent.body, ColoredRow);
};

const makeColorBodyHelper = (stt) => stt.type === 'BlockStatement' ? stt.body : [stt];

const colorAlternate = (after, before, ColoredRows) => {
    ColoredRows[1].push(before.loc.start.line);
    if(after.alternate.type === 'BlockStatement') {
        before.alternate.color = 'limegreen';
        ColoredRows[0].push(before.alternate.loc.start.line);
    }
    makeColorBody(makeColorBodyHelper(after.alternate), makeColorBodyHelper(before.alternate), ColoredRows);
};

const colorBodyHelper = (afStt,befStt,coloredRows) => {
    if (afStt.type === 'WhileStatement') {
        befStt.color = 'limegreen'; befStt.test.color = 'limegreen';
        if (eval(escodegen.generate(afStt.test))) whileBody(afStt, befStt, coloredRows);
    }
    else{
        befStt.color = 'limegreen';
        coloredRows[0].push(befStt.loc.start.line);
    }
};

const makeColorBody = (after, before, coloredRows) => {
    for(let index = 0; index < after.length; index++){
        let afStt = after[index];
        let befStt = before[index];
        if(afStt.type === 'IfStatement'){
            befStt.test.color = 'limegreen';
            eval(escodegen.generate(afStt.test)) ? colorConsequent(afStt, befStt, coloredRows) :
                afStt.alternate !== null ? colorAlternate(afStt, befStt, coloredRows)
                    : coloredRows[1].push(befStt.loc.start.line);
        }
        colorBodyHelper(afStt,befStt,coloredRows);
    }
};

export {parseCode};
