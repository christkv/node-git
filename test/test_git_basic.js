require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git/repo').Repo,
  Git = require('git/git').Git,
  fs = require('fs'),
  Commit = require('git/commit').Commit,
  Blob = require('git/blob').Blob,
  GitFileOperations = require('git/git_file_operations').GitFileOperations;

var suite = exports.suite = new TestSuite("git basic tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

// Chomp text removing end carriage returns
var chomp = function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}

suite.addTests({  
  "Should correctly init gitdir":function(assert, finished) {
    var tmp_path = '/tmp/gitdir';
    GitFileOperations.fs_rmdir_r(tmp_path, function(err, result) {
      // Create a temp directory
      fs.mkdirSync(tmp_path, 16877);
      // create Git repo
      var git = new Git(tmp_path);
      git.init({}, function(err, git) {
        var stat = fs.statSync(tmp_path + "/config");
        assert.equal(true, stat.isFile());   
        finished();
      });      
    })
  },
  
  "Should correctly merge logs":function(assert, finished) {
    var c1 = '420eac97a826bfac8724b6b0eef35c20922124b7';
    var c2 = '30e367cef2203eba2b341dc9050993b06fd1e108';
    var git = new Git("./test/dot_git");
    
    git.rev_list({pretty:'raw', max_count:10}, 'master', function(err, rev_output) {
      assert.ok(rev_output.match("commit " + c1));
      assert.ok(rev_output.match("commit " + c2));
      finished();
    })
  },
  
  "Should correctly honor max count":function(assert, finished) {
    var git = new Git("./test/dot_git");
    git.rev_list({max_count:10}, 'master', function(err, rev_output) {
      assert.equal(10, rev_output.split(/\n/).length);
      finished();
    })    
  },
  
  "Should correctly retrieve the diff between two commits":function(assert, finished) {
    var commit1 = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
    var commit2 = '420eac97a826bfac8724b6b0eef35c20922124b7';
  
    var git = new Git("./test/dot_git");
    git.diff(commit1, commit2, function(err, out) {
      assert.equal(null, err);
      assert.ok(out.match('index 6afcf64..9e78ddf 100644'));
      finished();
    });
  },
  
  "Should correctly perform single diff":function(assert, finished) {
    var commit1 = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
  
    var git = new Git("./test/dot_git");
    git.diff(commit1, null, function(err, out) {
      assert.equal(null, err);
      assert.ok(out.match('index ad42ff5..aa50f09 100644'));
      finished();
    })
  },
  
  "Should correctly perform full diff":function(assert, finished) {
    var commit1 = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
    var commit2 = '420eac97a826bfac8724b6b0eef35c20922124b7';    
  
    var git = new Git("./test/dot_git");
    git.diff(commit1, commit2, {full_index:true}, function(err, out) {
      assert.equal(null, err);
      assert.ok(out.match('index 6afcf64c80da8253fa47228eb09bc0eea217e5d1..9e78ddfaabf79f8314cc9a53a2f59775aee06bd7'));
      finished();
    })
  },
  
  "Should correctly perform add diff":function(assert, finished) {
    var commit1 = 'c9cf68fc61bd2634e90a4f6a12d88744e6297c4e';
    var commit2 = '7a8d32cb18a0ba2ff8bf86cadacc3fd2816da219';    
  
    var git = new Git("./test/dot_git");
    git.diff(commit1, commit2, {}, function(err, out) {
      assert.equal(null, err);
      assert.ok(out.indexOf('--- /dev/null\n+++ b/test/test_tag.rb') != -1);
      assert.ok(out.indexOf('diff --git a/test/test_tag.rb b/test/test_tag.rb') != -1);
      assert.ok(out.indexOf('index 0000000..2e3b0cb') != -1);
      finished();
    })
  },
  
  "Should correctly perform remove diff":function(assert, finished) {
    var commit1 = 'c9cf68fc61bd2634e90a4f6a12d88744e6297c4e';
    var commit2 = '7a8d32cb18a0ba2ff8bf86cadacc3fd2816da219';    
  
    var git = new Git("./test/dot_git");
    git.diff(commit1, commit2, {}, function(err, out) {
      assert.equal(null, err);
      assert.ok(out.indexOf('--- a/test/fixtures/diff_2\n+++ /dev/null') != -1);
      assert.ok(out.indexOf('diff --git a/test/fixtures/diff_2 b/test/fixtures/diff_2') != -1);
      assert.ok(out.indexOf('index 0000000..2e3b0cb') != -1);
      finished();
    });    
  },
  
  "Should correctly cat file contents from commit":function(assert, finished) {
    var commit_sha = '5e3ee1198672257164ce3fe31dea3e40848e68d5';
    
    var git = new Git("./test/dot_git");
    git.cat_file("p", commit_sha, function(err, out) {
      assert.equal(null, err);
      assert.equal(fixture('cat_file_commit_ruby'), out);
      finished();
    });
  },
  
  "Should correctly cat file contents from tree":function(assert, finished) {
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    
    var git = new Git("./test/dot_git");
    git.cat_file("p", tree_sha, function(err, out) {
      assert.equal(null, err);
      assert.equal(fixture('cat_file_tree_ruby', true), out);
      finished();
    });
  },
  
  "Should correctly cat file contents from blob":function(assert, finished) {
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
    
    var git = new Git("./test/dot_git");
    git.cat_file("p", blob_sha, function(err, out) {
      assert.equal(null, err);
      assert.equal(fixture('cat_file_blob_ruby'), out);
      finished();
    });
  },
  
  "Should correctly cat file size":function(assert, finished) {
    var blob_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    
    var git = new Git("./test/dot_git");
    git.cat_file("s", blob_sha, function(err, out) {
      assert.equal(null, err);
      assert.equal('252', out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree":function(assert, finished) {
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    
    var git = new Git("./test/dot_git");
    git.ls_tree(tree_sha, function(err, out) {
      assert.equal(null, err);
      assert.equal(fixture('cat_file_tree_ruby', true), out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree with blobs":function(assert, finished) {
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
    
    var git = new Git("./test/dot_git");
    git.ls_tree(blob_sha, function(err, out) {
      assert.equal(null, err);
      assert.equal(null, out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree with treeish":function(assert, finished) {
    var git = new Git("./test/dot_git");
  
    git.ls_tree('testing', function(err, out) {
      assert.equal(null, err);
      assert.equal(fixture('cat_file_tree_ruby', true), out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree with ls_tree_paths":function(assert, finished) {
    var git = new Git("./test/dot_git");
    var paths = ['History.txt', 'lib'];
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
  
    git.ls_tree(tree_sha, paths, function(err, out) {
      assert.equal(null, err);
      assert.equal(fixture('ls_tree_paths_ruby', true), out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree with ls_tree_paths multi single":function(assert, finished) {
    var git = new Git("./test/dot_git");
    var paths = ['lib/grit.rb'];
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
  
    git.ls_tree(tree_sha, paths, function(err, out) {
      assert.equal(null, err);
      assert.equal("100644 blob 6afcf64c80da8253fa47228eb09bc0eea217e5d1\tlib/grit.rb", out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree with recursive":function(assert, finished) {
    // this is the tree associated with @commit_sha, which we use in
    // the next test    
    var git = new Git("./test/dot_git");
    var tree_sha = '77fc9894c0904279fde93adc9c0ba231515ce68a';
  
    git.ls_tree(tree_sha, null, {r:true}, function(err, out) {      
      assert.equal(null, err);
      assert.equal(fixture('ls_tree_recursive'), out);
      finished();
    });
  },
  
  "Should correctly execute ls_tree with recursive and a commit":function(assert, finished) {
    var git = new Git("./test/dot_git");
    var commit_sha = '5e3ee1198672257164ce3fe31dea3e40848e68d5';
  
    git.ls_tree(commit_sha, null, {r:true}, function(err, out) {      
      assert.equal(null, err);
      assert.equal(fixture('ls_tree_recursive'), out);
      finished();
    });
  },
  
  "Should correctly execute rev_list pretty":function(assert, finished) {
    var git = new Git("./test/dot_git");
  
    git.rev_list({pretty:'raw'}, 'master', function(err, out) {
      assert.equal(fixture('rev_list_all'), out);
      finished();      
    });
  },
});

















