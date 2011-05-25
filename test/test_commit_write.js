var testCase = require('nodeunit').testCase,
  Repo = require('../lib/git').Repo,
  fs = require('fs'),
  Commit = require('../lib/git').Commit,
  Blob = require('../lib/git').Blob;

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

  "Should correctly fetch commit index":function(assert) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {  
      repo.git.commit = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('commit'));
        }
        
      repo.commit_index('my message', function(err, results) {
        assert.ok(results.indexOf('Created commit') != -1)
        assert.done();
      })
    });    
  },
  
  "Should correctly commit all":function(assert) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {  
      repo.git.commit = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('commit'));
        }
        
      repo.commit_all('my message', function(err, results) {
        assert.ok(results.indexOf('Created commit') != -1)
        assert.done();
      })
    });        
  }
});

















