require.paths.unshift("./lib", "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  fs = require('fs'),
  Repo = require('git').Repo,
  Merge = require('git').Merge;

var suite = exports.suite = new TestSuite("raw tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Should correctly parse the raw object":function(assert, finished) {
    var tag_sha = 'f0055fda16c18fd8b27986dbf038c735b82198d7';
    
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      var tag = repo.git.repository.get_object_by_sha1(tag_sha);
      assert.ok(tag.raw_content.match(/v0.7.0/))
      finished();
    });        
  }
});



















