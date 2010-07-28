require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  fs = require('fs'),
  Repo = require('git').Repo,
  Merge = require('git').Merge;

var suite = exports.suite = new TestSuite("remote tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Should correctly parse the raw object":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.remotes(function(err, remotes) {
        assert.ok(remotes.length > 0)
        finished();
      })
    });        
  }
});



















