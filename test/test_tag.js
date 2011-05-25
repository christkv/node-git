var testCase = require('nodeunit').testCase,
  fs = require('fs'),
  exec  = require('child_process').exec,
  Repo = require('../lib/git').Repo,
  BinaryParser = require('../lib/git').BinaryParser,
  Actor = require('../lib/git').Actor,
  Blob = require('../lib/git').Blob,
  Submodule = require('../lib/git').Submodule;

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
module.exports = testCase({   
  setUp: function(callback) {
    callback();
  },
  
  tearDown: function(callback) {
    callback();
  },

  // list_from_string size
  "Should correctly fetch tag list and have correct string size":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        assert.equal(5, tags.length);
        assert.done();
      })      
    });
  },

  // list_from_string  
  "Should correctly fetch tag list from string":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        var tag = tags[1];
        
        assert.equal('not_annotated', tag.name);
        assert.equal('ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a', tag.commit.id);
        assert.done();
      })      
    });    
  },
  
  // list_from_string_for_signed_tag
  "Should correctly fetch signed tag":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        var tag = tags[2];
                
        assert.equal('v0.7.0', tag.name);
        assert.equal('7bcc0ee821cdd133d8a53e8e7173a334fef448aa', tag.commit.id);
        assert.done();
      })      
    });    
  },
  
  // list_from_string_for_annotated_tag
  "Should correctly fetch annotated tag":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        var tag = tags[0];
                
        assert.equal('annotated', tag.name);
        assert.equal('ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a', tag.commit.id);
        assert.done();
      })      
    });        
  },
  
  // list_from_string_for_packed_tag
  "Should correctly fetch annotated tag":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        var tag = tags[0];
                
        assert.equal('annotated', tag.name);
        assert.equal('ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a', tag.commit.id);
        assert.done();
      })      
    });        
  },
  
  // test_list_from_string_for_packed_tag
  "Should correctly fetch packed tag":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        var tag = tags[4];
                
        assert.equal('packed', tag.name);
        assert.equal('ca8a30f5a7f0f163bbe3b6f0abf18a6c83b0687a', tag.commit.id);
        assert.done();
      })      
    });
  },

  // list_from_string_for_packed_annotated_tag
  "Should correctly fetch packed annotated tag":function(assert) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      repo.tags(function(err, tags) {
        var tag = tags[3];
                
        assert.equal('packed_annotated', tag.name);
        assert.equal('7bcc0ee821cdd133d8a53e8e7173a334fef448aa', tag.commit.id);
        assert.done();
      })      
    });
  },
});



















