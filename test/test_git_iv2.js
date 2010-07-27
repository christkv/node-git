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

var suite = exports.suite = new TestSuite("node-git iv2 tests");

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
  "Should correctly execute basic test":function(assert, finished) {
    var commit_sha = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a';
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';
    
    new Repo("./test/dot_git_iv2", {is_bare:true}, function(err, repo) {         
      var rgit = repo.git.repository;
      rgit.object_exists(commit_sha, function(err, result) {
        assert.ok(result);
        
        repo.commits(function(err, commits) {
          assert.equal(10, commits.length);
          finished();
        });        
      })
    });
  },
  
  "Should correctly test objects":function(assert, finished) {
    var commit_sha = 'ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a';
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881';
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce';

    new Repo("./test/dot_git_iv2", {is_bare:true}, function(err, repo) {         
      var rgit = repo.git.repository;
      
      var commit = rgit.get_object_by_sha1(commit_sha);
      assert.equal('schacon@gmail.com', commit.author.email);
      var tree = rgit.get_object_by_sha1(tree_sha);
      assert.equal(7, tree.entries.length);
      var blob = rgit.get_object_by_sha1(blob_sha);
      assert.ok(blob.content.indexOf('First public release') != -1);
      finished();
    });
  }  
});



















