require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  fs = require('fs'),
  FileIndex = require('git').FileIndex;

var suite = exports.suite = new TestSuite("file index tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({
  "Count all entries":function(assert, finished) {
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.count_all(function(err, count) {
        assert.equal(107, count);
        finished();
      })
    });    
  },
  
  "Count for a given sha":function(assert, finished) {
    var commit = "c12f398c2f3c4068ca5e01d736b1c9ae994b2138";
    
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.count(commit, function(err, count) {
        assert.equal(20, count);
        finished();
      })
    });
  },
  
  "Retrieve all files for a commit":function(assert, finished) {
    var commit = "c12f398c2f3c4068ca5e01d736b1c9ae994b2138";
    
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.files(commit, function(err, files) {
        assert.equal(4, files.length);
        assert.equal("lib/grit/blob.rb", files[0]);
        finished();
      })
    });
  },
  
  "Retrieve all commits for a given file":function(assert, finished) {
    var commit = "c12f398c2f3c4068ca5e01d736b1c9ae994b2138";
    
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.commits_for('lib/grit/blob.rb', function(err, commits) {
        assert.ok(commits.indexOf("3e0955045cb189a7112015c26132152a94f637bf") != -1);
        assert.equal(8, commits.length)
        finished();
      })
    });    
  },
  
  "Retrieve array of last commits":function(assert, finished) {
    var commit = "c12f398c2f3c4068ca5e01d736b1c9ae994b2138";
    
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.last_commits(commit, ['lib/grit/git.rb', 'lib/grit/actor.rb', 'lib/grit/commit.rb'], function(err, commits_by_file) {
        assert.equal('74fd66519e983a0f29e16a342a6059dbffe36020', commits_by_file['lib/grit/git.rb']);
        assert.equal(commit, commits_by_file['lib/grit/commit.rb']);
        assert.equal(null, commits_by_file['lib/grit/actor.rb']);
        finished();
      })
    });    
  },
  
  "Retrieve array of last commits based on regexp pattern":function(assert, finished) {
    var commit = "c12f398c2f3c4068ca5e01d736b1c9ae994b2138";
    
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.last_commits(commit, /lib\/grit\/[^\/]*$/, function(err, commits_by_file) {
        assert.equal(10, Object.keys(commits_by_file).length);
        assert.equal(commit, commits_by_file['lib/grit/commit.rb']);
        assert.equal(null, commits_by_file['lib/grit/actor.rb']);
        finished();
      })
    });        
  },
  
  "Retrieve last commits containing a directory in array":function(assert, finished) {
    var commit = "c12f398c2f3c4068ca5e01d736b1c9ae994b2138";
    
    new FileIndex("./test/dot_git", function(err, file_index) {
      file_index.last_commits(commit, ['lib/grit.rb', 'lib/grit/'], function(err, commits_by_file) {
        assert.equal(commit, commits_by_file['lib/grit/']);
        finished();
      })
    });    
  }
});

















