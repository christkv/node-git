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

  "Should correctly parse the raw object":function(assert) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.remotes(function(err, remotes) {
        assert.ok(remotes.length > 0)
        assert.done();
      })
    });        
  }
});



















