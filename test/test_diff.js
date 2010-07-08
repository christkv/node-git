require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git/repo').Repo,
  fs = require('fs'),
  Diff = require('git/diff').Diff,
  Blob = require('git/blob').Blob;

var suite = exports.suite = new TestSuite("diff tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({
  "Test list from string new mode":function(assert, finished) {

    new Repo("/Users/christian.kvalheim/coding/checkouts/grit", {is_bare:true}, function(err, repo) {
      var output = fixture('diff_new_mode');

      Diff.list_from_string(repo, output, function(err, diffs) {
        assert.equal(2, diffs.length)
        assert.equal(10, diffs[0].diff.split(/\n/).length)
        assert.equal(null, diffs.pop().diff)        
        finished();
      });      
    });
  }
});
