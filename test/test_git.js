var testCase = require('nodeunit').testCase,
  Git = require('../lib/git').Git;

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

  "Should correctly call native git method":function(assert) {
    var git = new Git("./test/grit");
    git.git('version', function(err, result) {
      assert.ok(!err);
      assert.ok(result.match(/^git version [\w\.]*/));
      assert.done();
    });
  },
  
  "Should fail to call wrong native method":function(assert) {
    var git = new Git("./test/grit");
    git.git('bad', function(err, result) {
      assert.ok(err);
      assert.ok(err.indexOf("git: 'bad' is not a git command") != -1);
      assert.done();
    })
  }, 
  
  "Should fail to call wrong native function with skip timeout":function(assert) {
    var git = new Git("./test/grit");
    git.git('bad', {timeout:false}, function(err, result) {
      assert.ok(err);
      assert.ok(err.indexOf("git: 'bad' is not a git command") != -1);
      assert.done();
    })    
  },
  
  "Should correctly transform options":function(assert) {
    var git = new Git("./test/grit");
    assert.deepEqual(["-s"], git.transform_options({s:true}));
    assert.deepEqual([], git.transform_options({s:false}));
    assert.deepEqual(["-s \"5\""], git.transform_options({s:5}));
  
    assert.deepEqual(["--max-count"], git.transform_options({max_count:true}));
    assert.deepEqual(["--max-count=\"5\""], git.transform_options({max_count:5}));
  
    assert.deepEqual(["-s", "-t"], git.transform_options({s:true, t:true}));
    assert.done();
  },
  
  "Should correctly escape calls to the git shell":function(assert) {
    var git = new Git("./test/grit");
    git.exec = function(call, options, callback) {
      assert.equal(Git.git_binary + " --git-dir='./test/grit' foo --bar='bazz\\'er'", call)
      assert.deepEqual({ encoding: 'utf8', timeout: 60000, killSignal: 'SIGKILL'}, options);
      callback(null, null);
    };
  
    git.git('foo', {bar:"bazz'er"}, function(err, result) {
      git.exec = function(call, options, callback) {
        assert.equal(Git.git_binary + " --git-dir='./test/grit' bar -x 'quu\\'x'", call)
        assert.deepEqual({ encoding: 'utf8', timeout: 60000, killSignal: 'SIGKILL'}, options);
        callback(null, null);
      };      
  
      git.git('bar', {x:"quu'x"}, function(err, result) {
        assert.done();
      });
    });
  },
  
  "Should correctly escape standalone argument":function(assert) {
    var git = new Git("./test/grit");
    git.exec = function(call, options, callback) {
      assert.equal(Git.git_binary + " --git-dir='./test/grit' foo 'bar\\'s'", call)
      assert.deepEqual({ encoding: 'utf8', timeout: 60000, killSignal: 'SIGKILL'}, options);
      callback(null, null);
    };
  
    git.git('foo', {}, "bar's", function(err, result) {
      git.exec = function(call, options, callback) {
        assert.equal(Git.git_binary + " --git-dir='./test/grit' foo 'bar' '\\; echo \\'noooo\\''", call)
        assert.deepEqual({ encoding: 'utf8', timeout: 60000, killSignal: 'SIGKILL'}, options);
        callback(null, null);
      };      
  
      git.git('foo', {}, "bar", "; echo 'noooo'", function(err, result) {
        assert.done();
      });
    });
  }
});



















