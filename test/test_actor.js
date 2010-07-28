require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  fs = require('fs'),
  Actor = require('git').Actor;

var suite = exports.suite = new TestSuite("actor tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  "Should create actor from string seperating name and email":function(assert, finished) {
    var actor = Actor.from_string("Tom Werner <tom@example.com>");
    assert.equal("Tom Werner", actor.name);
    assert.equal("tom@example.com", actor.email);
    finished();
  },
  
  "Should create actor from string only containing name":function(assert, finished) {
    var actor = Actor.from_string("Tom Werner");
    assert.equal("Tom Werner", actor.name);
    assert.equal(null, actor.email);
    finished();
  },
  
  "Should correctly return name when calling toString()":function(assert, finished) {
    var actor = Actor.from_string("Tom Werner <tom@example.com>");
    assert.equal(actor.name, actor.toString());
    finished();
  }
});

















