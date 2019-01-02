import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('EX3', () => {
    it('1. just return', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + '    return c;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2), '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1: return c",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [],\n' + '  "dit": [],\n' + '  "dif": []\n' + '}');});
    it('2. seqDecl + ret', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + 'let a = 1, b = 2;\n' + '    return c;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = 1, b = 2",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: return c",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      1,\n' + '      2\n' + '    ]\n' + '  ],\n' + '  "dit": [],\n' + '  "dif": []\n' + '}');});
    it('3. varDecl + ret + ass', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + 'let a = 1;\n' + 'a = 3;\n' + '    return a + x + y;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = 1    a = 3",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: return a + x + y",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      1,\n' + '      2\n' + '    ]\n' + '  ],\n' + '  "dit": [],\n' + '  "dif": []\n' + '}');});
    it('4. varDecl + ret + seq + update', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + 'let a = 1;\n' + 'a = 3, x++;\n' + '    return a + x + y;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = 1    a = 3, x++",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: return a + x + y",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      1,\n' + '      2\n' + '    ]\n' + '  ],\n' + '  "dit": [],\n' + '  "dif": []\n' + '}');});
    it('5. if no else', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + 'let a = 1;\n' + 'a = 3, x++;\n' + 'if(x < 2){\n' + 'a = 9;\n' + '}\n' + '    return a + x + y;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = 1    a = 3, x++",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": -2,\n' + '      "label": "",\n' + '      "shape": "ellipse",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: x < 2",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 3,\n' + '      "label": "3:     a = 9",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 4,\n' + '      "label": "4: return a + x + y",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      3,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      1,\n' + '      2\n' + '    ],\n' + '    [\n' + '      -2,\n' + '      4\n' + '    ]\n' + '  ],\n' + '  "dit": [\n' + '    [\n' + '      2,\n' + '      3\n' + '    ]\n' + '  ],\n' + '  "dif": [\n' + '    [\n' + '      2,\n' + '      -2\n' + '    ]\n' + '  ]\n' + '}');});
    it('6. if + else', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + 'let a = 1;\n' + 'a = 3, x++;\n' + 'if(x < 2){\n' + 'a = 9;\n' + '}else{\n' + 'a++;\n' + '}\n' + '    return a + x + y;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = 1    a = 3, x++",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": -2,\n' + '      "label": "",\n' + '      "shape": "ellipse",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: x < 2",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 3,\n' + '      "label": "3:     a = 9",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 4,\n' + '      "label": "4:     a++",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 5,\n' + '      "label": "5: return a + x + y",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      3,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      1,\n' + '      2\n' + '    ],\n' + '    [\n' + '      4,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      -2,\n' + '      5\n' + '    ]\n' + '  ],\n' + '  "dit": [\n' + '    [\n' + '      2,\n' + '      3\n' + '    ]\n' + '  ],\n' + '  "dif": [\n' + '    [\n' + '      2,\n' + '      4\n' + '    ]\n' + '  ]\n' + '}');});
    it('7. if + else if + else', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = x + 1     b = a + y     c = 0",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": -2,\n' + '      "label": "",\n' + '      "shape": "ellipse",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: b < z",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 3,\n' + '      "label": "3:     c = c + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 4,\n' + '      "label": "4: b < z * 2",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 5,\n' + '      "label": "5:     c = c + x + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 6,\n' + '      "label": "6:     c = c + z + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 7,\n' + '      "label": "7: return c",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      3,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      1,\n' + '      2\n' + '    ],\n' + '    [\n' + '      5,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      6,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      -2,\n' + '      7\n' + '    ]\n' + '  ],\n' + '  "dit": [\n' + '    [\n' + '      2,\n' + '      3\n' + '    ],\n' + '    [\n' + '      4,\n' + '      5\n' + '    ]\n' + '  ],\n' + '  "dif": [\n' + '    [\n' + '      2,\n' + '      4\n' + '    ],\n' + '    [\n' + '      4,\n' + '      6\n' + '    ]\n' + '  ]\n' + '}');});
    it('8. inner if', () => {assert.equal(JSON.stringify(parseCode('function f(x,y,z){\n' + '\tlet a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        if(c < 10){\n' + '        b = 9, a = 10;\n' + '        }\n' + '    }\n' + '    return c;\n' + '\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = x + 1     b = a + y     c = 0",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": -2,\n' + '      "label": "",\n' + '      "shape": "ellipse",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: b < z",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 3,\n' + '      "label": "3:     c = c + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": -4,\n' + '      "label": "",\n' + '      "shape": "ellipse",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 4,\n' + '      "label": "4: c < 10",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 5,\n' + '      "label": "5:     b = 9, a = 10",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 6,\n' + '      "label": "6: return c",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      5,\n' + '      -4\n' + '    ],\n' + '    [\n' + '      3,\n' + '      4\n' + '    ],\n' + '    [\n' + '      -4,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      1,\n' + '      2\n' + '    ],\n' + '    [\n' + '      -2,\n' + '      6\n' + '    ]\n' + '  ],\n' + '  "dit": [\n' + '    [\n' + '      2,\n' + '      3\n' + '    ],\n' + '    [\n' + '      4,\n' + '      5\n' + '    ]\n' + '  ],\n' + '  "dif": [\n' + '    [\n' + '      4,\n' + '      -4\n' + '    ],\n' + '    [\n' + '      2,\n' + '      -2\n' + '    ]\n' + '  ]\n' + '}');});
    it('9. inner if + else if', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = x + 1     b = a + y     c = 0",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": -2,\n' + '      "label": "",\n' + '      "shape": "ellipse",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: b < z",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 3,\n' + '      "label": "3:     c = c + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 4,\n' + '      "label": "4: b < z * 2",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 5,\n' + '      "label": "5:     c = c + x + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 6,\n' + '      "label": "6:     c = c + z + 5",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 7,\n' + '      "label": "7: return c",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      3,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      1,\n' + '      2\n' + '    ],\n' + '    [\n' + '      5,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      6,\n' + '      -2\n' + '    ],\n' + '    [\n' + '      -2,\n' + '      7\n' + '    ]\n' + '  ],\n' + '  "dit": [\n' + '    [\n' + '      2,\n' + '      3\n' + '    ],\n' + '    [\n' + '      4,\n' + '      5\n' + '    ]\n' + '  ],\n' + '  "dif": [\n' + '    [\n' + '      2,\n' + '      4\n' + '    ],\n' + '    [\n' + '      4,\n' + '      6\n' + '    ]\n' + '  ]\n' + '}');});
    it('10. while', () => {assert.equal(JSON.stringify(parseCode('function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' + '       c = a + b;\n' + '       z = c * 2;\n' + '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n', JSON.parse('{"x":1,"y":2,"z":3}')),null,2),
        '{\n' + '  "nodes": [\n' + '    {\n' + '      "id": 1,\n' + '      "label": "1:      a = x + 1     b = a + y     c = 0",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 2,\n' + '      "label": "2: NULL",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "green",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 3,\n' + '      "label": "3: a < z",\n' + '      "shape": "diamond",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 4,\n' + '      "label": "4:     c = a + b    z = c * 2    a++",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "lightgrey",\n' + '        "border": "black"\n' + '      }\n' + '    },\n' + '    {\n' + '      "id": 5,\n' + '      "label": "5: return z",\n' + '      "shape": "box",\n' + '      "size": 30,\n' + '      "color": {\n' + '        "background": "limegreen",\n' + '        "border": "black"\n' + '      }\n' + '    }\n' + '  ],\n' + '  "always": [\n' + '    [\n' + '      1,\n' + '      2\n' + '    ],\n' + '    [\n' + '      2,\n' + '      3\n' + '    ],\n' + '    [\n' + '      4,\n' + '      2\n' + '    ]\n' + '  ],\n' + '  "dit": [\n' + '    [\n' + '      3,\n' + '      4\n' + '    ]\n' + '  ],\n' + '  "dif": [\n' + '    [\n' + '      3,\n' + '      5\n' + '    ]\n' + '  ]\n' + '}');});});