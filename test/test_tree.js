require.paths.unshift("./lib", "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  fs = require('fs'),
  exec  = require('child_process').exec,
  Repo = require('git').Repo,
  BinaryParser = require('git').BinaryParser,
  Actor = require('git').Actor,
  Blob = require('git').Blob,
  Submodule = require('git').Submodule,
  Tree = require('git').Tree;

var suite = exports.suite = new TestSuite("node-git tree tests");

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
  // contents
  "Should correctly handle a no tree":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tree('blahblah', function(err, tree) {
        assert.ok(Array.isArray(tree.contents));
        assert.ok(tree instanceof Tree);
        finished();
      })      
    });    
  },
  
  "Should correctly handle a no tree":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      var number = 0;
      
      repo.git.ls_tree = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();

        if(number == 0) {
          number = number + 1;
          callback(null, fixture('ls_tree_a'));
        } else {
          number = number + 1;
          callback(null, fixture('ls_tree_b'));
        }
      }

      repo.tree('master', function(err, tree) {
        var child = tree.contents[tree.contents.length - 1];
        child.contents;
        child.contents;
        // Ensure the content was cached        
        assert.equal(2, number)
        finished();
      })      
    });    
  },
  
  // content_from_string
  "Should correctly return a tree from a content to string call":function(assert, finished) {
    var parts = fixture('ls_tree_a', true).split('\n');
    var text = parts[parts.length - 1];
    
    Tree.content_from_string(null, text, function(err, tree) {
      assert.ok(tree instanceof Tree);
      assert.equal('650fa3f0c17f1edb4ae53d8dcca4ac59d86e6c44', tree.id);
      assert.equal('040000', tree.mode);
      assert.equal('test', tree.name);
      finished();
    });
  },
  
  "Should correctly return blob from tree from string":function(assert, finished) {
    var parts = fixture('ls_tree_b', true).split('\n');
    var text = parts[0];
    
    Tree.content_from_string(null, text, function(err, tree) {
      assert.ok(tree instanceof Blob);
      assert.equal('aa94e396335d2957ca92606f909e53e7beaf3fbb', tree.id);
      assert.equal('100644', tree.mode);
      assert.equal('grit.rb', tree.name);
      finished();
    });
  },
  
  "Should correctly return submodule from tree from string":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      var parts = fixture('ls_tree_submodule', true).split('\n');
      var text = parts[0];
      
      Tree.content_from_string(null, text, function(err, tree) {
        assert.ok(tree instanceof Submodule);
        finished();
      });
    });
  },
  
  "Should correctly return error due to invalid type":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      Tree.content_from_string(null, "040000 bogus 650fa3f0c17f1edb4ae53d8dcca4ac59d86e6c44  test", function(err, tree) {
        assert.equal("invalid type: bogus", err);
        finished();
      });
    });
  },
  
  "Should correctly find file in tree":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.ls_tree = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        callback(null, fixture('ls_tree_a'));
      }

      repo.tree('master', function(err, tree) {
        assert.equal('aa06ba24b4e3f463b3c4a85469d0fb9e5b421cf8', tree.find('lib').id);
        assert.equal('8b1e02c0fb554eed2ce2ef737a68bb369d7527df', tree.find('README.txt').id);
        finished();
      });
    });
  },
  
  "Should correctly test find file with commits":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.git.ls_tree = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        var callback = args.pop();
        callback(null, fixture('ls_tree_commit'));
      }

      repo.tree('master', function(err, tree) {
        assert.equal('d35b34c6e931b9da8f6941007a92c9c9a9b0141a', tree.find('bar').id);
        assert.equal('2afb47bcedf21663580d5e6d2f406f08f3f65f19', tree.find('foo').id);
        assert.equal('f623ee576a09ca491c4a27e48c0dfe04be5f4a2e', tree.find('baz').id);
        finished();
      });
    });
  },
  
  "Should correctly extract base name":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      Tree.create(repo, {name:'foo/bar'}, function(err, tree) {
        assert.equal('bar', tree.basename);
        finished();
      });      
    });
  }
});



















