require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git/repo').Repo,
  fs = require('fs'),
  Blob = require('git/blob').Blob;

var suite = exports.suite = new TestSuite("blob tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  // blob
  "Should not locate blob":function(assert, finished) {
    // Open the first repo
    new Repo("/Users/christian.kvalheim/coding/checkouts/grit", {is_bare:true}, function(err, repo) {
      repo.blob("blahblah", function(err, blob) {
        assert.ok(blob instanceof Blob);
        finished();
      });
    });
  },
  
  "Should correctly return blob contents":function(assert, finished) {
    // Open the first repo
    new Repo("/Users/christian.kvalheim/coding/checkouts/grit", {is_bare:true}, function(err, repo) {
      repo.git.cat_file = function(type, ref, callback) {
          callback(null, fixture('cat_file_blob'));
        }
        
      var blob = new Blob(repo, 'abc');
      assert.equal("Hello world", blob.data);
      finished();
    });
  },
  
  "Should correctly cache data":function(assert, finished) {
    // Open the first repo
    new Repo("/Users/christian.kvalheim/coding/checkouts/grit", {is_bare:true}, function(err, repo) {
      var times_called = 0;
      
      repo.git.cat_file = function(type, ref, callback) {
          if(times_called == 1) throw "Caching not working";
          times_called = times_called + 1;
          callback(null, fixture('cat_file_blob'));
        }
        
      var blob = new Blob(repo, 'abc');
      assert.equal("Hello world", blob.data);
      assert.equal("Hello world", blob.data);
      finished();
    });
  },
  
  // size
  "Should correctly return the file size":function(assert, finished) {
    // Open the first repo
    new Repo("/Users/christian.kvalheim/coding/checkouts/grit", {is_bare:true}, function(err, repo) {
      repo.git.cat_file = function(type, ref, callback) {
          callback(null, fixture('cat_file_blob_size'));
        }
        
      var blob = new Blob(repo, 'abc');
      assert.equal(11, blob.size);
      finished();
    });             
  },
  
  // data
  
  // mime_type
  "Should correctly return mime_type for known types":function(assert, finished) {
    // Open the first repo
    new Repo("/Users/christian.kvalheim/coding/checkouts/grit", {is_bare:true}, function(err, repo) {
      var blob = new Blob(repo, 'abc', 'foo.png');
      assert.equal('image/png', blob.mime_type);
      finished();
    });
  }
});

















