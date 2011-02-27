require.paths.unshift("./lib", "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  fs = require('fs'),
  Actor = require('git').Actor,
  Git = require('git').Git;

var suite = exports.suite = new TestSuite("blame tree tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  "Should correctly retrieve blame tree":function(assert, finished) {
    var git = new Git("./test/dot_git");
    var commit = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
    git.blame_tree(commit, function(err, tree) {
      assert.equal('7bcc0ee821cdd133d8a53e8e7173a334fef448aa', tree['History.txt']);
      finished();
    });
  },
  
  "Should correctly retrieve blame tree path":function(assert, finished) {
    var git = new Git("./test/dot_git");
    var commit = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
    git.blame_tree(commit, 'lib', function(err, tree) {
      assert.equal('5a0943123f6872e75a9b1dd0b6519dd42a186fda', tree['lib/grit.rb']);
      assert.equal('2d3acf90f35989df8f262dc50beadc4ee3ae1560', tree['lib/grit']);
      finished();
    });
  },
  
  "Should correctly retrieve blame tree for multiple paths":function(assert, finished) {
    var git = new Git("./test/dot_git");
    var commit = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
    git.blame_tree(commit, 'lib/grit', function(err, tree) {
      assert.equal('22825175e37f22c9418d756ca69b574d75602994', tree['lib/grit/diff.rb']);
      finished();
    });
  }
});

















