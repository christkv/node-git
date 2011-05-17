
var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  BinaryParser = require('git').BinaryParser;

var suite = exports.suite = new TestSuite("node-git alt tests");

var to_bin = function(sha1o) {
  var sha1 = '';
  for(var i = 0; i < sha1o.length; i = i + 2) {
    sha1 = sha1 + String.fromCharCode(parseInt(sha1o.substr(i, 2), 16));
  }  
  return sha1;
}

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Should correctly execute basic":function(assert, finished) {
    // Sha's
    var commit_sha = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a';
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
    // Binary form of sha1
    var sha_hex = to_bin(commit_sha);

    // Populate repos
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) { 
      var repo1 = repo; 

      new Repo("./test/dot_git_clone", {is_bare:true}, function(err, repo) { 
        var repo2 = repo; 
        
        repo1.git.repository.in_loose(sha_hex, function(err, result) {
          assert.ok(result);
        });
        
        repo2.git.repository.in_loose(sha_hex, function(err, result) {
          assert.ok(result);
        });
        
        repo1.git.repository.object_exists(commit_sha, function(err, result) {
          assert.ok(result);
        });
        
        repo2.git.repository.object_exists(commit_sha, function(err, result) {
          assert.ok(result);
        });
        
        repo1.commits(function(err, commits) {
          assert.equal(10, commits.length);
        })

        repo2.commits(function(err, commits) {
          assert.equal(10, commits.length);
          finished();
        })
    });
    });
  }, 
  
  "Should correctly work with clone of clone":function(assert, finished) {
    // Sha's
    var commit_sha = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a';
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
    // Binary form of sha1
    var sha_hex = to_bin(commit_sha);

    // Populate repos
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) { 
      var repo1 = repo; 

      new Repo("./test/dot_git_clone", {is_bare:true}, function(err, repo) { 
        var repo2 = repo; 
        
        new Repo("./test/dot_git_clone2", {is_bare:true}, function(err, repo) { 
          var repo3 = repo; 
          
          repo2.git.repository.in_loose(sha_hex, function(err, result) {
            assert.ok(result);
          });
          
          repo3.git.repository.in_loose(sha_hex, function(err, result) {
            assert.ok(result);
          });
          
          repo2.git.repository.object_exists(commit_sha, function(err, result) {
            assert.ok(result);
          });
          
          repo3.git.repository.object_exists(commit_sha, function(err, result) {
            assert.ok(result);
          });
          
          repo2.commits(function(err, commits) {
            assert.equal(10, commits.length);
          })
          
          repo3.commits(function(err, commits) {
            assert.equal(10, commits.length);
            finished();
          })
        });        
      });
    });    
  }
});



















