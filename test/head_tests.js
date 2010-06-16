require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git/repo').Repo,
  Ref = require('git/ref').Ref,
  Head = require('git/head').Head,
  Blob = require('git/blob').Blob,
  Tree = require('git/tree').Tree,
  fs = require('fs'),
  exec  = require('child_process').exec;

var suite = exports.suite = new TestSuite("repo tests");

var create_tmp_directory = function(clone_path, callback) {
  var filename = 'git_test' + new Date().getTime().toString() + Math.round((Math.random(100000) * 300)).toString();
  var tmp_path = '/tmp/' + filename;
  // Create directory
  fs.mkdirSync(tmp_path, 0777);
  // Copy the old directory to the new one
  var child = exec('cp -R ' + clone_path + ' ' + tmp_path, function (error, stdout, stderr) {
      sys.print('stdout: ' + stdout);
      sys.print('stderr: ' + stderr);
      if (error !== null) {
        sys.puts('exec error: ' + error);
        return callback(error, null);
      }
      return callback(null, tmp_path + '/dot_git');    
  });
}

var fixture = function(name) {
  fs.readFileSync("./test/fixtures/" + name);
}

var destroy_directory = function(directory, callback) {
  // Copy the old directory to the new one
  var child = exec('rm -rf ' + directory, function (error, stdout, stderr) {
      sys.print('stdout: ' + stdout);
      sys.print('stderr: ' + stderr);
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
  "Should update refs packed":function(assert, finished) {
    create_tmp_directory("./test/dot_git", function(err, target_path) {
      var repo = new Repo(target_path, {is_bare:true});
      
      // new and existing
      var test   = 'ac9a30f5a7f0f163bbe3b6f0abf18a6c83b06872'
      var master = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a'
      
      repo.update_ref('testref', test, function(err, result) {
        repo.get_head('testref', function(err, head) {
          assert.ok(head.commit.sha != master);

          repo.update_ref('testref', test, function(err, result) {
            repo.get_head('testref', function(err, head) {
              assert.ok(head.commit.sha != master)
            })
          })
        })
      });
      
      repo.get_head('nonpack', function(err, head) {
        var old = head.commit.sha;
        repo.update_ref('nonpack', test, function(err, result) {
          assert.ok(result.commit.sha != old);

          destroy_directory(target_path, function(err, result) {
            finished();        
          })
        })
      })      
    });    
  },
  
  "Should raise error on invalid repo location":function(assert, finished) {
    try {
      var repo = new Repo('/tmp');
    } catch(err) {
      finished();
    }
  },
  
  "Should raise error on non existing path":function(assert, finished) {
    try {
      var repo = new Repo('/foobar');
    } catch(err) {
      finished();
    }
  },
  
  // Description
  "Should correctly retrieve the description":function(assert, finished) {
    var repo = new Repo("./..");
    repo.description(function(err, description) {
      assert.ok(description.indexOf("Unnamed repository; edit this file") != -1);
      finished();
    })
  },
  
  // Refs
  "Should correctly return array of ref objects":function(assert, finished) {
    var repo = new Repo("./..");
    repo.refs(function(err, refs) {
      refs.forEach(function(ref) {
        assert.ok(ref instanceof Ref);
      })
      
      finished();
    })    
  },
  
  // Heads
  "Should correctly return the current head":function(assert, finished) {
    var repo = new Repo("./test/dot_git", {is_bare:true});
    repo.head(function(err, head) {
      assert.ok(head instanceof Head);
      assert.equals('master', head.name);
      
      repo.commits(head.name, function(err, commits) {
        assert.equals('ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a', commits[0].id);
        finished();
      });
    })
  },
  
  "Should correcty return array of head objects":function(assert, finished) {
    var repo = new Repo("./..", {is_bare:true});
    repo.heads(function(err, heads) {
      heads.forEach(function(head) {
        assert.ok(head instanceof Head);        
      })
      finished();
    })
  },
  
  "Should populate head data":function(assert, finished) {
    var repo = new Repo("./test/dot_git", {is_bare:true});
    repo.heads(function(err, heads) {
      var head = heads[0];
      
      assert.equals('test/master', head.name);
      head.commit(function(err, commit) {
        assert.equals('2d3acf90f35989df8f262dc50beadc4ee3ae1560', commit.id);
        finished();
      })
    })
  },
  
  // Commits
  
  "Should correctly fetch commits":function(assert, finished) {
    var repo = new Repo("./..", {is_bare:true});
    repo.rev_list = function() { return fixture('rev_list')};
    
    repo.commits('master', 10, function(err, commits) {
      var commit = commits[0];
      
      assert.equals('4c8124ffcf4039d292442eeccabdeca5af5c5017', c.id);
      commit.parents(function(err, p_commits) {
        var p_commit_ids = p_commits.map(function(p_commit) {
          return p_commit.id;
        })
        assert.deepEqual(["634396b2f541a9f2d58b00be1a07f0c358b999b3"], p_commit_ids);
      })
      
      assert.equals('672eca9b7f9e09c22dcb128c283e8c3c8d7697a4', commit.tree.id);
      assert.equals('Tom Preston-Werner', commit.author.name);
      assert.equals('tom@mojombo.com', commit.author.email);
      assert.equals(new Date(1191999972*1000), commit.authored_date);
      assert.equals('Tom Preston-Werner', commit.committer.name);
      assert.equals('tom@mojombo.com', commit.committer.email);
      assert.equals(new Date(1191999972*1000), commit.committed_date);
      assert.equals('implement Grit#heads', commit.message);
      
      commit = commits[1];
      commit.parents(function(err, p_commits) {
        assert.deepEqual([], p_commits);
      })
      
      commit = commits[2]
      commit.parents(function(err, p_commits) {
        var p_commit_ids = p_commits.map(function(p_commit) {
          return p_commit.id;
        })        
        assert.deepEqual(["6e64c55896aabb9a7d8e9f8f296f426d21a78c2c", "7f874954efb9ba35210445be456c74e037ba6af2"], p_commit_ids);
      })
      assert.equals("Merge branch 'site'\n\n  * Some other stuff\n  * just one more", commit.message);
      assert.equals("Merge branch 'site'", commit.short_message);
      finished();
    })
  },
  
  // commit count
  "Should correctly retrieve the commit count":function(assert, finished) {
    var repo = new Repo("./..", {is_bare:true});
    repo.commit('634396b2f541a9f2d58b00be1a07f0c358b999b3', function(err, commit) {
      assert.equals('634396b2f541a9f2d58b00be1a07f0c358b999b3', commit.id);
      finished();
    })
  }
  
  // tree
  "Should correctly retrieve the repo tree":function(assert, finished) {
    var repo = new Repo("./..", {is_bare:true});
    repo.ls_tree = function() { return fixture('ls_tree_a')};    
    
    repo.tree('master', function(err, tree) {
      tree.contents(function(err, entries) {
        var entries_1 = entries.filter(function(entry) { return entry instanceof Blob; })
        var entries_2 = entries.filter(function(entry) { return entry instanceof Tree; })
        assert.equals(4, entries_1.length);
        assert.equals(3, entries_2.length);
        finished();
      });
    });
  }
  
    
});






