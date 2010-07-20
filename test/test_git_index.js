require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  fs = require('fs'),
  exec  = require('child_process').exec,
  Repo = require('git/repo').Repo,
  BinaryParser = require('git/binary_parser').BinaryParser,
  Actor = require('git/actor').Actor,
  Blob = require('git/blob').Blob;

var suite = exports.suite = new TestSuite("node-git index tests");

var to_bin = function(sha1o) {
  var sha1 = '';
  for(var i = 0; i < sha1o.length; i = i + 2) {
    sha1 = sha1 + String.fromCharCode(parseInt(sha1o.substr(i, 2), 16));
  }  
  return sha1;
}

var create_tmp_directory = function(clone_path, callback) {
  var filename = 'git_test' + new Date().getTime().toString() + Math.round((Math.random(100000) * 300)).toString();
  var tmp_path = '/tmp/' + filename;
  // Create directory
  fs.mkdirSync(tmp_path, 0777);
  // Copy the old directory to the new one
  var child = exec('cp -R ' + clone_path + ' ' + tmp_path, function (error, stdout, stderr) {
      if (error !== null) {
        sys.puts('exec error: ' + error);
        return callback(error, null);
      }
      return callback(null, tmp_path);
  });
}

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

var destroy_directory = function(directory, callback) {
  // Copy the old directory to the new one
  var child = exec('rm -rf ' + directory, function (error, stdout, stderr) {
      if (error !== null) {
        sys.puts('exec error: ' + error);
        return callback(error, null);
      }
      return callback(null, null);    
  });  
}

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Sould correctly add files":function(assert, finished) {
    var base_repo = "/Users/christian.kvalheim/coding/checkouts/grit/test/dot_git_iv2"

    create_tmp_directory(base_repo, function(err, target_path) {
      new Repo(target_path + "/dot_git_iv2", {is_bare:true}, function(err, repo) {         
        // try {
        var repository = repo.git.repository;
        var user = Actor.from_string("Tom Werner <tom@example.com>");

        // Fetch the commits
        repo.commits(function(err, commits) {
          sys.puts("=============================================================== commits")
          // sys.puts(sys.inspect(commits))
          

          var sha = commits[0].tree.id;
          
          repo.index(function(err, index) {
            // Read the tree in
            index.read_tree(sha, function(err, tree) {
              // Add files
              index.add('atester.rb', 'test stuff');
              index.commit('message', [commits[0]], user, null, 'master', function(err, result) {
                
                // Destory directory and cleanup
                destroy_directory(target_path, function(err, result) {          
                  finished();
                });                
              })              
            });            
          });
        })
      });
    });
  }
  
  // "Should correctly execute basic":function(assert, finished) {
  //   // Sha's
  //   var commit_sha = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a';
  //   var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
  //   var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
  //   // Binary form of sha1
  //   var sha_hex = to_bin(commit_sha);
  // 
  //   // Populate repos
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) { 
  //     var repo1 = repo; 
  // 
  //     new Repo("./test/dot_git_clone", {is_bare:true}, function(err, repo) { 
  //       var repo2 = repo; 
  //       
  //       repo1.git.repository.in_loose(sha_hex, function(err, result) {
  //         assert.ok(result);
  //       });
  //       
  //       repo2.git.repository.in_loose(sha_hex, function(err, result) {
  //         assert.ok(result);
  //       });
  //       
  //       repo1.git.repository.object_exists(commit_sha, function(err, result) {
  //         assert.ok(result);
  //       });
  //       
  //       repo2.git.repository.object_exists(commit_sha, function(err, result) {
  //         assert.ok(result);
  //       });
  //       
  //       repo1.commits(function(err, commits) {
  //         assert.equal(10, commits.length);
  //       })
  // 
  //       repo2.commits(function(err, commits) {
  //         assert.equal(10, commits.length);
  //         finished();
  //       })
  //   });
  //   });
  // }, 
  // 
  // "Should correctly work with clone of clone":function(assert, finished) {
  //   // Sha's
  //   var commit_sha = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a';
  //   var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
  //   var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
  //   // Binary form of sha1
  //   var sha_hex = to_bin(commit_sha);
  // 
  //   // Populate repos
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) { 
  //     var repo1 = repo; 
  // 
  //     new Repo("./test/dot_git_clone", {is_bare:true}, function(err, repo) { 
  //       var repo2 = repo; 
  //       
  //       new Repo("./test/dot_git_clone2", {is_bare:true}, function(err, repo) { 
  //         var repo3 = repo; 
  //         
  //         repo2.git.repository.in_loose(sha_hex, function(err, result) {
  //           assert.ok(result);
  //         });
  //         
  //         repo3.git.repository.in_loose(sha_hex, function(err, result) {
  //           assert.ok(result);
  //         });
  //         
  //         repo2.git.repository.object_exists(commit_sha, function(err, result) {
  //           assert.ok(result);
  //         });
  //         
  //         repo3.git.repository.object_exists(commit_sha, function(err, result) {
  //           assert.ok(result);
  //         });
  //         
  //         repo2.commits(function(err, commits) {
  //           assert.equal(10, commits.length);
  //         })
  //         
  //         repo3.commits(function(err, commits) {
  //           assert.equal(10, commits.length);
  //           finished();
  //         })
  //       });        
  //     });
  //   });    
  // }
});



















