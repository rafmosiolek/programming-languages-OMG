var myProgram = [
    ['#print', 'hello, world!'],
    ['#print', 'this is my programming language!']
]

function run(expressions) {
    for (var expression of expressions) {
        var [command, ...args] = expression;

        if (command === '#print') {
            console.log(...args);
        } else {
            throw new Error('Unknown command ' + command);
        }
    }
}

run(myProgram);