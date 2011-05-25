var testCase = require('nodeunit').testCase,
  fs = require('fs'),
  Repo = require('../lib/git').Repo,
  Merge = require('../lib/git').Merge;

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

/**
  Test basic node-git functionality
**/
module.exports = testCase({   
  setUp: function(callback) {
    callback();
  },
  
  tearDown: function(callback) {
    callback();
  },

  "Should correctly create merge from string":function(assert) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {        
      var merge_text = fixture("merge_result");
      var merge = new Merge(merge_text);

      assert.equal(3, merge.sections);
      assert.equal(1, merge.conflicts);
      assert.done();
    });        
  }
});



















