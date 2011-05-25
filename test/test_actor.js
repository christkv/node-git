var testCase = require('nodeunit').testCase,
  Repo = require('../lib/git').Repo,
  fs = require('fs'),
  Actor = require('../lib/git').Actor;

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

module.exports = testCase({
  setUp: function(callback) {
    callback();
  },
  
  tearDown: function(callback) {
    callback();
  },
  
  "Should create actor from string seperating name and email":function(assert) {
    var actor = Actor.from_string("Tom Werner <tom@example.com>");
    assert.equal("Tom Werner", actor.name);
    assert.equal("tom@example.com", actor.email);
    assert.done();
  },
  
  "Should create actor from string only containing name":function(assert) {
    var actor = Actor.from_string("Tom Werner");
    assert.equal("Tom Werner", actor.name);
    assert.equal(null, actor.email);
    assert.done();
  },
  
  "Should correctly return name when calling toString()":function(assert) {
    var actor = Actor.from_string("Tom Werner <tom@example.com>");
    assert.equal(actor.name, actor.toString());
    assert.done();
  }
});

















