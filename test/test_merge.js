require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  fs = require('fs'),
  Repo = require('git').Repo,
  Merge = require('git').Merge;

var suite = exports.suite = new TestSuite("merge tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Should correctly create merge from string":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {        
      var merge_text = fixture("merge_result");
      var merge = new Merge(merge_text);

      assert.equal(3, merge.sections);
      assert.equal(1, merge.conflicts);
      finished();
    });        
  }
});



















