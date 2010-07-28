require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  fs = require('fs'),
  Commit = require('git').Commit,
  Blob = require('git').Blob;

var suite = exports.suite = new TestSuite("commit write tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  "Should correctly fetch commit index":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {  
      repo.git.commit = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('commit'));
        }
        
      repo.commit_index('my message', function(err, results) {
        assert.ok(results.indexOf('Created commit') != -1)
        finished();
      })
    });    
  },
  
  "Should correctly commit all":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {  
      repo.git.commit = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('commit'));
        }
        
      repo.commit_all('my message', function(err, results) {
        assert.ok(results.indexOf('Created commit') != -1)
        finished();
      })
    });        
  }
});

















