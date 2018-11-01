var myProgram = [
    ['#def', '#age', 23],
    [
        '#if',
        ['#greater-than', '#age', 18], 
        ['#print', 'you can buy a drink'],
        ['#print', 'no drink for you']
    ],
    ['#def', '#status', ['#if', 
        ['#greater-than', '#age', 18], 'drinking ok', 'drinking not ok']
    ],
    ['#print', '#status']
]

class Scope {
    constructor() {
        this.variables = {};
    }

    get(name) {
        if (name in this.variables) {
            return this.variables[name]
        } else {
            throw new Error(name + ' is not defined.');
        }
    }

    set(name, value) {
        console.log("SET", name, value)
        this.variables[name] = value;
    }
}

var keywords = {
    '#def': (scope, name, rawValue) => {
        var value = evalExpression(rawValue, scope);
        scope.set(name, value);
        return value;
    },
    '#if': (scope, condition, resultIfTrue, resultIfFalse) => {
        var evalCondition = evalExpression(condition, scope);
        if (evalCondition) {
            return evalExpression(resultIfTrue, scope);
        } else {
            return evalExpression(resultIfFalse, scope);
        }
    }
}

var library = {
    '#print': (...args) => {
        console.log(...args);
    },
    '#add': (...args) => {
        return args.reduce((a, b) => a + b);
    },
    '#substract': (...args) => {
        return args.reduce((a, b) => a - b);
    },
    '#greater-than': (a, b) => {
        return a > b;
    }
}

function evalExpression(expression, scope) {
    if (Array.isArray(expression)) {
        return evalSExpression(expression, scope)
    } else if (typeof expression === 'string' && expression[0] === '#') {
        console.log('variable reference: ', expression);
        return scope.get(expression);
    } else {
        return expression;
    }
}

function evalSExpression(expression, scope) {
    var [command, ...rawArgs] = expression;

    if (command in keywords) {
        var keywordFn = keywords[command];
        return keywordFn(scope, ...rawArgs);
    }

    var args = [];

    for (rawArg of rawArgs) {
        var evaluatedArg = evalExpression(rawArg, scope);
        args.push(evaluatedArg);
    }

    if (command in library) {
        var fn = library[command];
        return fn(...args);
    } else {
        throw new Error('Unknown command ' + command);  
    }
}


function run(expressions) {
    var scope = new Scope();
    for (var expression of expressions) {
        evalSExpression(expression, scope);
    }
}

run(myProgram);
