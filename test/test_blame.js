require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git/repo').Repo,
  fs = require('fs'),
  Actor = require('git/actor').Actor;

var suite = exports.suite = new TestSuite("blame tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  "Should correctly provide simple blame":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      var commit = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
      repo.blame('History.txt', commit, function(err, blame) {
        assert.ok(!err);
        
        assert.equal(5, blame.lines.length);
  
        var line = blame.lines[2];
        assert.equal('* 1 major enhancement', line.line);
        assert.equal(3, line.lineno);
        assert.equal(3, line.oldlineno);
        assert.equal('634396b2f541a9f2d58b00be1a07f0c358b999b3', line.commit.id);        
        finished();
      })
    });    
  },
  
  "Should correctly provide deep blame":function(assert, finished) {
    new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
      var commit = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
      repo.blame('lib/grit.rb', commit, function(err, blame) {
        assert.ok(!err);
        
        assert.equal(37, blame.lines.length);

        var line = blame.lines[24];
        assert.equal("require 'grit/diff'", line.line);
        assert.equal(25, line.lineno);
        assert.equal(16, line.oldlineno);
        assert.equal('46291865ba0f6e0c9818b11be799fe2db6964d56', line.commit.id);        
        finished();
      })
    });        
  }
});

















