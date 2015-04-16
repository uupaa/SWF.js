var ModuleTestSWF = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit && /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

return new Test("SWF", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testSWF_value,
        testSWF_isNumber,
        testSWF_isInteger,
    ]).run().clone();

function testSWF_value(test, pass, miss) {

    var result = new SWF(123.4).value();

    if (result === 123.4) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testSWF_isNumber(test, pass, miss) {

    var result = [
            new SWF(123.4).isNumber(),  // true
            new SWF(123.0).isNumber()   // true
        ];

    if (!/false/.test(result.join())) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

function testSWF_isInteger(test, pass, miss) {

    var result = [
           !new SWF(123.4).isInteger(), // !false -> true
            new SWF(123.0).isInteger()  // true
        ];

    if (!/false/.test(result.join())) {
        test.done(pass());
    } else {
        test.done(miss());
    }
}

})((this || 0).self || global);

