var testCase = require('nodeunit').testCase,
  Repo = require('../lib/git').Repo,
  fs = require('fs'),
  Blob = require('../lib/git').Blob,
  Commit = require('../lib/git').Commit;

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

module.exports = testCase({   
  setUp: function(callback) {
    callback();
  },
  
  tearDown: function(callback) {
    callback();
  },

  // blob
  "Should not locate blob":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.blob("blahblah", function(err, blob) {
        assert.ok(blob instanceof Blob);
        assert.done();
      });
    });
  },
  
  "Should correctly return blob contents":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.git.cat_file = function(type, ref, callback) {
          callback(null, fixture('cat_file_blob'));
        }
        
      var blob = new Blob(repo, 'abc');
      assert.equal("Hello world", blob.data);
      assert.done();
    });
  },
  
  "Should correctly cache data":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var times_called = 0;
      
      repo.git.cat_file = function(type, ref, callback) {
          if(times_called == 1) throw "Caching not working";
          times_called = times_called + 1;
          callback(null, fixture('cat_file_blob'));
        }
        
      var blob = new Blob(repo, 'abc');
      assert.equal("Hello world", blob.data);
      assert.equal("Hello world", blob.data);
      assert.done();
    });
  },
  
  // size
  "Should correctly return the file size":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.git.cat_file = function(type, ref, callback) {
          callback(null, fixture('cat_file_blob_size'));
        }
        
      var blob = new Blob(repo, 'abc');
      assert.equal(11, blob.size);
      assert.done();
    });             
  },
  
  // data
  
  // mime_type
  "Should correctly return mime_type for known types":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var blob = new Blob(repo, null, 'abc', 'foo.png');
      assert.equal('image/png', blob.mime_type);
      assert.done();
    });
  },
  
  "Should correctly return text plain for unknown types":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var blob = new Blob(repo, 'abc');
      assert.equal('text/plain', blob.mime_type);
      assert.done();
    });    
  },
  
  // blame
  
  "Should correctly grab the blame":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      repo.git.blame = function(type, ref, callback) {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('blame'));
        }      
      
      Blob.blame(repo, 'master', 'lib/grit.rb', function(err, blame) {
        assert.equal(13, blame.length);
        assert.equal(25, blame.reduce(function(previousValue, currentValue, index, array){ return previousValue + currentValue[currentValue.length - 1].length;}, 0))
        assert.equal(blame[0][0].object_id, blame[9][0].object_id)
        
        var commit = blame[0][0];
        assert.equal('634396b2f541a9f2d58b00be1a07f0c358b999b3', commit.id);        
        assert.equal('Tom Preston-Werner', commit.author.name);
        assert.equal('tom@mojombo.com', commit.author.email);
        assert.deepEqual(new Date(1191997100 * 1000), commit.authored_date);
        assert.equal('Tom Preston-Werner', commit.committer.name);
        assert.equal('tom@mojombo.com', commit.committer.email);
        assert.deepEqual(new Date(1191997100 * 1000), commit.committed_date);
        assert.equal('initial grit setup', commit.message);        
        assert.done();
      });
    });
  },
  
  "Should correctly return the base name":function(assert) {
    // Open the first repo
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var blob = new Blob(repo, null, null, 'foo/bar.rb');
      assert.equal('bar.rb', blob.basename);
      assert.done();
    });        
  }
});

















