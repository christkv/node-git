var testCase = require('nodeunit').testCase,
  fs = require('fs'),
  Repo = require('../lib/git').Repo;

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
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

  "Should correctly add a file":function(assert) {
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
        assert.done();
      })
    });    
  },
  
  "Should correctly add an array":function(assert) {
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
        assert.done();
      })
    });
  },
  
  "Should correctly remove a file":function(assert) {
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
        assert.done();
      })
    });    
  },
  
  "Should correctly remove an array":function(assert) {
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
        assert.done();
      })
    });
  },
  
  "Should correctly execute status":function(assert) {
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
        assert.done();
      });
    });    
  }
});



















