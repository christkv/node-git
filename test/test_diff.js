var testCase = require('nodeunit').testCase,
  Repo = require('../lib/git').Repo,
  fs = require('fs'),
  Diff = require('../lib/git').Diff,
  Blob = require('../lib/git').Blob;

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

  "Test list from string new mode":function(assert) {

    new Repo("./test/grit", {is_bare:true}, function(err, repo) {
      var output = fixture('diff_new_mode');

      Diff.list_from_string(repo, output, function(err, diffs) {
        assert.equal(2, diffs.length)
        assert.equal(10, diffs[0].diff.split(/\n/).length)
        assert.equal(null, diffs.pop().diff)        
        assert.done();
      });      
    });
  }
});
