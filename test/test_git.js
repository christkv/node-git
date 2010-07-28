require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Git = require('git').Git;

var suite = exports.suite = new TestSuite("node-git tests");

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Should correctly call native git method":function(assert, finished) {
    var git = new Git("./test/grit");
    git.git('version', function(err, result) {
      assert.ok(!err);
      assert.ok(result.match(/^git version [\w\.]*/));
      finished();
    });
  },
  
  "Should fail to call wrong native method":function(assert, finished) {
    var git = new Git("./test/grit");
    git.git('bad', function(err, result) {
      assert.ok(err);
      assert.ok(err.indexOf("git: 'bad' is not a git-command") != -1);
      finished();
    })
  }, 
  
  "Should fail to call wrong native function with skip timeout":function(assert, finished) {
    var git = new Git("./test/grit");
    git.git('bad', {timeout:false}, function(err, result) {
      assert.ok(err);
      assert.ok(err.indexOf("git: 'bad' is not a git-command") != -1);
      finished();
    })    
  },
  
  "Should correctly transform options":function(assert, finished) {
    var git = new Git("./test/grit");
    assert.deepEqual(["-s"], git.transform_options({s:true}));
    assert.deepEqual([], git.transform_options({s:false}));
    assert.deepEqual(["-s '5'"], git.transform_options({s:5}));
  
    assert.deepEqual(["--max-count"], git.transform_options({max_count:true}));
    assert.deepEqual(["--max-count='5'"], git.transform_options({max_count:5}));
  
    assert.deepEqual(["-s", "-t"], git.transform_options({s:true, t:true}));
    finished();
  },
  
  "Should correctly escape calls to the git shell":function(assert, finished) {
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
        finished();
      });
    });
  },
  
  "Should correctly escape standalone argument":function(assert, finished) {
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
        finished();
      });
    });
  }
});



















