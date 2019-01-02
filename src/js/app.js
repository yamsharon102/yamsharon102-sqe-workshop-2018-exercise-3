import $ from 'jquery';
import * as vis from 'vis';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#Enter').click(() => {
        let codeToParse = $('#toParse').val();
        let params = $('#params').val();
        let parsedCode = parseCode(codeToParse, JSON.parse(params));
        let always = makeEdges(parsedCode.always, '');
        let dit = makeEdges(parsedCode.dit, 'T');
        let dif = makeEdges(parsedCode.dif, 'F');
        let toPut = {nodes: new vis.DataSet(parsedCode.nodes), edges: new vis.DataSet(always.concat(dit).concat(dif))};
        new vis.Network(document.getElementById('network'), toPut, {hierarchical: true});
    });
});

const toPush = (x, l) => {return {from: x[0], to: x[1], label: l, color: 'black', arrows: 'to', smooth: true};};

const makeEdges = (lists,label) =>{
    let ret = [];
    lists.map(x => ret.push(toPush(x, label)));
    return ret;
};