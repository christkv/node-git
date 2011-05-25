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
    var tag_sha = 'f0055fda16c18fd8b27986dbf038c735b82198d7';
    
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      var tag = repo.git.repository.get_object_by_sha1(tag_sha);
      assert.ok(tag.raw_content.match(/v0.7.0/))
      assert.done();
    });        
  }
});



















