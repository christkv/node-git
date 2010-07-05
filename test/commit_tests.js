require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git/repo').Repo,
  fs = require('fs'),
  Commit = require('git/commit').Commit;

var suite = exports.suite = new TestSuite("commit tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  // __bake__
  "Test commit bake":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.rev_list = function(a, b, callback) {
          callback(null, fixture('rev_list_single'));
        }
        
      var commit = new Commit(repo, '4c8124ffcf4039d292442eeccabdeca5af5c5017')
      assert.equal("Tom Preston-Werner", commit.author.name);
      assert.equal("tom@mojombo.com", commit.author.email);        
      finished();
    });    
  },
  
  // short_name
  "Test abbreviation of id":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.commit('80f136f500dfdb8c3e8abf4ae716f875f0a1b57f', function(err, commit) {
        commit.id_abbrev(function(err, id_abbrev) {
          assert.equal("80f136f", id_abbrev);
          finished();        
        })
      });
    });        
  },
  
  // count
  "Test commit count":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      Commit.count(repo, 'master', function(err, count) {
        assert.equal(107, count);
        finished();
      })
    });    
  },
  
  // diff
  "Test correct execution of diff":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.diff = function(a, b, callback) {
          assert.equal(true, a['full_index']);
          assert.equal('master', b);        
          callback(null, fixture('diff_p'));
        }
        
      // Fetch the diff
      Commit.diff(repo, 'master', function(err, diffs) {
        assert.equal('.gitignore', diffs[0].a_path);
        assert.equal('.gitignore', diffs[0].b_path);
        assert.equal('4ebc8aea50e0a67e000ba29a30809d0a7b9b2666', diffs[0].a_blob.id);
        assert.equal('2dd02534615434d88c51307beb0f0092f21fd103', diffs[0].b_blob.id);
        assert.equal('100644', diffs[0].b_mode);
        assert.equal(false, diffs[0].new_file);
        assert.equal(false, diffs[0].deleted_file);
        assert.equal("--- a/.gitignore\n+++ b/.gitignore\n@@ -1 +1,2 @@\n coverage\n+pkg", diffs[0].diff);
        
        assert.equal('lib/grit/actor.rb', diffs[5].a_path);
        assert.equal(null, diffs[5].a_blob);
        assert.equal('f733bce6b57c0e5e353206e692b0e3105c2527f4', diffs[5].b_blob.id);
        assert.equal(true, diffs[5].new_file);
        finished();
      });
    });        
  },
  
  "Test diff with two commits":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.diff = function(a, b, c, callback) {
          assert.equal(true, a['full_index']);
          assert.equal('59ddc32', b);        
          assert.equal('13d27d5', c);        
          callback(null, fixture('diff_2'));
        }
        
      // Fetch the diff
      Commit.diff(repo, '59ddc32', '13d27d5', function(err, diffs) {
        assert.equal(3, diffs.length);
        assert.deepEqual(["lib/grit/commit.rb", "test/fixtures/show_empty_commit", "test/test_commit.rb"], diffs.map(function(diff) { return diff.a_path; }));
        finished();
      });
    });    
  },
  
  "Test diff with files":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.diff = function(a, b, c, d, callback) {
          assert.equal(true, a['full_index']);
          assert.equal('59ddc32', b);        
          assert.equal('--', c);        
          assert.equal('lib', d);
          callback(null, fixture('diff_f'));
        }
        
      // Fetch the diff
      Commit.diff(repo, '59ddc32', ["lib"], function(err, diffs) {
        assert.equal(1, diffs.length);
        assert.deepEqual('lib/grit/diff.rb', diffs[0].a_path);
        finished();
      });
    });        
  },
  
  "Test diff with two commits and files":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.diff = function(a, b, c, d, e, callback) {
          assert.equal(true, a['full_index']);
          assert.equal('59ddc32', b);
          assert.equal('13d27d5', c);
          assert.equal('--', d);
          assert.equal('lib', e);
          callback(null, fixture('diff_2f'));
        }
        
      // Fetch the diff
      Commit.diff(repo, '59ddc32', '13d27d5', ["lib"], function(err, diffs) {
        assert.equal(1, diffs.length);
        assert.deepEqual('lib/grit/commit.rb', diffs[0].a_path);
        finished();
      });
    });    
  },
  
  // diffs
  "Test diffs":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.diff = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('diff_p'));
        }
        
      // Fetch the diff
      var commit = new Commit(repo, '91169e1f5fa4de2eaea3f176461f5dc784796769');
      commit.diffs(function(err, diffs) {
        assert.equal(15, diffs.length);
        
        assert.equal('.gitignore', diffs[0].a_path);
        assert.equal('.gitignore', diffs[0].b_path);
        assert.equal('4ebc8aea50e0a67e000ba29a30809d0a7b9b2666', diffs[0].a_blob.id);
        assert.equal('2dd02534615434d88c51307beb0f0092f21fd103', diffs[0].b_blob.id);
        assert.equal('100644', diffs[0].b_mode);
        assert.equal(false, diffs[0].new_file);
        assert.equal(false, diffs[0].deleted_file);
        assert.equal("--- a/.gitignore\n+++ b/.gitignore\n@@ -1 +1,2 @@\n coverage\n+pkg", diffs[0].diff);
        
        assert.equal('lib/grit/actor.rb', diffs[5].a_path);
        assert.equal(null, diffs[5].a_blob);
        assert.equal('f733bce6b57c0e5e353206e692b0e3105c2527f4', diffs[5].b_blob.id);
        assert.equal(true, diffs[5].new_file);
        
        finished();
      });
    });        
  }, 
  
  "Test diffs on initial import":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.show = function(options, sha, callback) {
          assert.deepEqual({full_index:true, pretty:'raw'}, options);
          assert.equal('634396b2f541a9f2d58b00be1a07f0c358b999b3', sha);          
          callback(null, fixture('diff_i'));
        }
        
      // Fetch the diff
      var commit = new Commit(repo, '634396b2f541a9f2d58b00be1a07f0c358b999b3');
      commit.diffs(function(err, diffs) {
        assert.equal(10, diffs.length);
        
        assert.equal('History.txt', diffs[0].a_path);
        assert.equal('History.txt', diffs[0].b_path);
        assert.equal(null, diffs[0].a_blob);
        assert.equal(null, diffs[0].b_mode);
        assert.equal('81d2c27608b352814cbe979a6acd678d30219678', diffs[0].b_blob.id);
        assert.equal(false, diffs[0].new_file);
        assert.equal(false, diffs[0].deleted_file);
        assert.equal("--- /dev/null\n+++ b/History.txt\n@@ -0,0 +1,5 @@\n+== 1.0.0 / 2007-10-09\n+\n+* 1 major enhancement\n+  * Birthday!\n+", diffs[0].diff);
        
        assert.equal('lib/grit.rb', diffs[5].a_path);
        assert.equal(null, diffs[5].a_blob);
        assert.equal('32cec87d1e78946a827ddf6a8776be4d81dcf1d1', diffs[5].b_blob.id);
        assert.equal(true, diffs[5].new_file);        
        finished();
      });
    });        
    
  }
});

















