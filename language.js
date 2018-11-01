var myProgram = [
    ['#print', 'hello, world!'],
    ['#print', '2 + 2 + 2 =', ['#add', ['#add', 2, 2], 2]],
    ['#print', '4 - 2 =', ['#substract', 4, 2]],
    ['#def', '#x', 2],
    ['#def', '#y', ['#add', 2, 2]],
    ['#print', '#x'],
    ['#print', '#y'],
    ['#def', '#x', ['#add', '#x', '#y']],
    ['#print', 'yay', '#x']
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