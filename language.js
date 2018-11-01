var myProgram = [
    ['#print', 'hello, world!'],
    ['#print', '2 + 2 + 2 =', ['#add', ['#add', 2, 2], 2]]
]

function evalExpression(expression) {
    if (Array.isArray(expression)) {
        return evalFunctionCall(expression)
    } else {
        return expression;
    }
}

function evalFunctionCall(expression) {
    var [command, ...rawArgs] = expression;
    var args = [];

    for (rawArg of rawArgs) {
        var evaluatedArg = evalExpression(rawArg);
        args.push(evaluatedArg);
    }

    switch (command) {
        case '#print':
            console.log(...args);
            break;
        case '#add':
            return args[0] + args[1];
            break;
        default:
            throw new Error('Unknown command ' + command);
    }
}


function run(expressions) {
    for (var expression of expressions) {
        evalFunctionCall(expression);
    }
}

run(myProgram);