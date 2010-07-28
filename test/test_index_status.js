require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  fs = require('fs'),
  Repo = require('git').Repo;

var suite = exports.suite = new TestSuite("index status tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Should correctly add a file":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {        
      repo.git.add = function(a, b, c) {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();

        assert.deepEqual({}, a);
        assert.equal('file1', b);
        assert.equal('file2', c);
        callback(null, null);
      }
      
      repo.add('file1', 'file2', function(err, result) {
        assert.ok(!err)
        assert.ok(!result)
        finished();
      })
    });    
  },
  
  "Should correctly add an array":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {        
      repo.git.add = function(a, b, c) {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();

        assert.deepEqual({}, a);
        assert.equal('file1', b);
        assert.equal('file2', c);
        callback(null, null);
      }
      
      repo.add(['file1', 'file2'], function(err, result) {
        assert.ok(!err)
        assert.ok(!result)
        finished();
      })
    });
  },
  
  "Should correctly remove a file":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {        
      repo.git.remove = function(a, b, c) {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();

        assert.deepEqual({}, a);
        assert.equal('file1', b);
        assert.equal('file2', c);
        callback(null, null);
      }
      
      repo.remove('file1', 'file2', function(err, result) {
        assert.ok(!err)
        assert.ok(!result)
        finished();
      })
    });    
  },
  
  "Should correctly remove an array":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {        
      repo.git.remove = function(a, b, c) {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
      
        assert.deepEqual({}, a);
        assert.equal('file1', b);
        assert.equal('file2', c);
        callback(null, null);
      }
      
      repo.remove(['file1', 'file2'], function(err, result) {
        assert.ok(!err)
        assert.ok(!result)
        finished();
      })
    });
  },
  
  "Should correctly execute status":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.git.diff_index = function(a, b) {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();        
        assert.deepEqual({}, a);
        assert.equal('HEAD', b);
        callback(null, fixture("diff_index"));
      }
      
      repo.git.diff_files = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        callback(null, fixture('diff_files'));
      }
      
      repo.git.ls_files = function(a) {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        assert.deepEqual({stage:true}, a);
        callback(null, fixture('ls_files'));
      }
      
      // Get the status of the repository
      repo.status(function(err, status) {
        var stat = status.index('lib/grit/repo.rb');
        assert.equal('71e930d551c413a123f43e35c632ea6ba3e3705e', stat.sha_repo);
        assert.equal('100644', stat.mode_repo);
        assert.equal('M', stat.type);
        finished();
      });
    });    
  }
});



















