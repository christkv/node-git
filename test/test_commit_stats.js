
TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  fs = require('fs'),
  Blob = require('git').Blob,
  Commit = require('git').Commit,
  GitFileOperations = require('git').GitFileOperations;

var suite = exports.suite = new TestSuite("commit stats tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  "Should correctly retrieve commit stats":function(assert, finished) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var back_exists = GitFileOperations.fs_exist;
      
      GitFileOperations.fs_exist = function(dir, path, callback) {         
        var args = Array.prototype.slice.call(arguments, 0);
        // Pop the callback
        var callback = args.pop();
        callback(null, true); }              
      
      repo.git.log = function(type, ref, callback) {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('log'));
        }      
      
      // Fetch the commit stats for the repo
      repo.commit_stats(function(err, stats) {
        assert.ok(!err);
        assert.equal(3, Object.keys(stats).length);
        // Reset the overriden function
        GitFileOperations.fs_exist = back_exists;
        finished();
      })
    });    
  },
  
  "Should correctly match the content":function(assert, finished) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var back_exists = GitFileOperations.fs_exist;
      
      GitFileOperations.fs_exist = function(dir, path, callback) {         
        var args = Array.prototype.slice.call(arguments, 0);
        // Pop the callback
        var callback = args.pop();
        callback(null, true); }              
      
      repo.git.log = function(type, ref, callback) {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('log'));
        }      
      
      // Fetch the commit stats for the repo
      repo.commit_stats(function(err, stats) {
        assert.ok(!err);
        assert.equal(3, Object.keys(stats).length);
        assert.equal('{"id":"a49b96b339c525d7fd455e0ad4f6fe7b550c9543","files":[["examples/ex_add_commit.rb",13,0,13],["examples/ex_index.rb",1,1,2]],"additions":14,"deletions":1,"total":15}', JSON.stringify(stats[Object.keys(stats)[0]]));
        assert.equal('{"id":"8f19810374686ad23dd63342b08d4ad1e65204c4","files":[["examples/ex_index.rb",14,0,14],["lib/grit/git-ruby.rb",1,1,2],["lib/grit/git-ruby/repository.rb",1,5,6],["lib/grit/index.rb",31,12,43],["lib/grit/ref.rb",2,2,4]],"additions":49,"deletions":20,"total":69}', JSON.stringify(stats[Object.keys(stats)[1]]));
        assert.equal('{"id":"28f28c504f3ebb647dadd5d504aaf8133aecadd9","files":[["API.txt",101,0,101],["PURE_TODO",1,0,1],["benchmarks.rb",129,0,129]],"additions":231,"deletions":0,"total":231}', JSON.stringify(stats[Object.keys(stats)[2]]));        
        // Test associate fetch
        assert.equal('{"id":"a49b96b339c525d7fd455e0ad4f6fe7b550c9543","files":[["examples/ex_add_commit.rb",13,0,13],["examples/ex_index.rb",1,1,2]],"additions":14,"deletions":1,"total":15}', JSON.stringify(stats['a49b96b339c525d7fd455e0ad4f6fe7b550c9543']));
        // Reset the overriden function
        GitFileOperations.fs_exist = back_exists;
        finished();
      })
    });        
  }  
});

















