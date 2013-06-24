var testCase = require('nodeunit').testCase,
  fs = require('fs'),
  exec  = require('child_process').exec,
  Repo = require('../lib/git').Repo,
  BinaryParser = require('../lib/git').BinaryParser,
  Actor = require('../lib/git').Actor,
  Blob = require('../lib/git').Blob;

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
module.exports = testCase({   
  setUp: function(callback) {
    callback();
  },
  
  tearDown: function(callback) {
    callback();
  },

  "Sould correctly add files":function(assert) {
    var base_repo = "./test/dot_git_iv2"
  
    create_tmp_directory(base_repo, function(err, target_path) {
      new Repo(target_path + "/dot_git_iv2", {is_bare:true}, function(err, repo) {         
        var repository = repo.git.repository;
        var user = Actor.from_string("Tom Werner <tom@example.com>");
  
        // Fetch the commits
        repo.commits(function(err, commits) {
          var sha = commits[0].tree.id;
          
          repo.index(function(err, index) {
            // Read the tree in
            index.read_tree(sha, function(err, tree) {
              // Add files
              index.add('atester.rb', 'test stuff');
              index.commit('message', [commits[0]], user, null, 'master', function(err, result) {
                repo.commits(function(err, _commits) {
                  var c = _commits[0].tree.find('atester.rb');
                  assert.equal('f80c3b68482d5e1c8d24c9b8139340f0d0a928d0', c.id)
                  // Destory directory and cleanup
                  destroy_directory(target_path, function(err, result) {          
                    assert.done();
                  });                
                });
              });
            });            
          });
        });
      });
    });
  },
  
  "Should correctly add path file":function(assert) {
    var base_repo = "./test/dot_git_iv2"
  
    create_tmp_directory(base_repo, function(err, target_path) {
      new Repo(target_path + "/dot_git_iv2", {is_bare:true}, function(err, repo) {         
        var repository = repo.git.repository;
        var user = Actor.from_string("Tom Werner <tom@example.com>");
  
        // Fetch the commits
        repo.commits(function(err, commits) {
          var sha = commits[0].tree.id;
          
          repo.index(function(err, index) {
            // Read the tree in
            index.read_tree(sha, function(err, tree) {
              // Add files
              index.add('lib/atester.rb', 'test stuff');
              // Commit files
              index.commit('message', [commits[0]], user, null, 'master', function(err, result) {
                repo.commits(function(err, _commits) {
                  // Retrieve the first commit
                  var c = _commits[0].tree.find('lib').find('atester.rb');
                  assert.equal('f80c3b68482d5e1c8d24c9b8139340f0d0a928d0', c.id)
                  c = _commits[0].tree.find('lib').find('grit.rb');
                  assert.equal('77aa887449c28a922a660b2bb749e4127f7664e5', c.id)
                  // Destroy directory and cleanup
                  destroy_directory(target_path, function(err, result) {          
                    assert.done();
                  });                
                });
              });
            });
          });
        });
      });
    });    
  },
  
  "Should correctly add correct order for commited files":function(assert) {
    var base_repo = "./test/dot_git_iv2"
  
    create_tmp_directory(base_repo, function(err, target_path) {
      new Repo(target_path + "/dot_git_iv2", {is_bare:true}, function(err, repo) {         
        var repository = repo.git.repository;
        var user = Actor.from_string("Tom Werner <tom@example.com>");
  
        // Fetch the commits
        repo.commits(function(err, commits) {
          var sha = commits[0].tree.id;
          
          repo.index(function(err, index) {
            // Read the tree in
            index.read_tree(sha, function(err, tree) {
              // Add files
              index.add('lib.rb', 'test stuff');
              // Commit files
              index.commit('message', [commits[0]], user, null, 'master', function(err, result) {
                repo.commits(function(err, _commits) {
                  // Retrieve the names from the tree contents
                  var tr = _commits[0].tree.contents;
                  var entries = tr.filter(function(c) { return c.name.substr(0, 3) == 'lib'; }).map(function(c) { return c.name; });
                  // Assert correct order
                  assert.equal('lib.rb', entries[0]);
                  assert.equal('lib', entries[1]);                  
                  // Destroy directory and cleanup
                  destroy_directory(target_path, function(err, result) {          
                    assert.done();
                  });                
                });
              });
            });
          });
        });
      });
    });        
  },
  
  "Should correctly modify file":function(assert) {
    var base_repo = "./test/dot_git_iv2"
  
    create_tmp_directory(base_repo, function(err, target_path) {
      new Repo(target_path + "/dot_git_iv2", {is_bare:true}, function(err, repo) {         
        var repository = repo.git.repository;
        var user = Actor.from_string("Tom Werner <tom@example.com>");
  
        // Fetch the commits
        repo.commits(function(err, commits) {
          var sha = commits[0].tree.id;
          
          repo.index(function(err, index) {
            // Read the tree in
            index.read_tree(sha, function(err, tree) {
              // Add files
              index.add('README.txt', 'test more stuff');
              // Commit files
              index.commit('message', [commits[0]], user, null, 'master', function(err, result) {
                repo.commits(function(err, _commits) {
                  // Retrieve the names from the tree contents
                  var b = _commits[0].tree.find('README.txt');
                  assert.equal('e45d6b418e34951ddaa3e78e4fc4d3d92a46d3d1', b.id);
                  // Destroy directory and cleanup
                  destroy_directory(target_path, function(err, result) {          
                    assert.done();
                  });                
                });
              });
            });
          });
        });
      });
    });        
  }
});



















