require.paths.unshift("./lib", "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Repo = require('git').Repo,
  fs = require('fs'),
  Commit = require('git').Commit,
  Blob = require('git').Blob;

var suite = exports.suite = new TestSuite("config tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

suite.addTests({  
  "Should correctly return an assoc array":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {  
      repo.git.config = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          // Pop the callback
          var callback = args.pop();
          callback(null, fixture('simple_config'));
        }
      
      repo.config(function(err, config) {
        assert.equal("git://github.com/mojombo/grit.git", config.fetch("remote.origin.url"));
        assert.equal(null, config.fetch("unknown"));
        assert.equal("false", config.fetch("core.bare"));
        assert.equal("default", config.fetch("unknown", "default"));
        finished();
      });
    });        
  },
  
  "Should correctly set value":function(assert, finished) {
    new Repo("./test/grit", {is_bare:true}, function(err, repo) {  
      repo.git.config = function() {        
          var args = Array.prototype.slice.call(arguments, 0);                    
          // Pop the callback
          var callback = args.pop();          
          var options = args.shift();
          // Just return if we are done
          if(options['list']) return callback(null, fixture('simple_config'));


          var value = args.shift();
          var default_value = args.shift();
          
          assert.deepEqual({}, options);
          assert.equal('unknown', value);
          assert.equal('default', default_value);          
          callback(null, fixture('simple_config'));
        }
      
      
      repo.config(function(err, config) {
        config.set("unknown", "default", function(err, result) {
          assert.ok(!err);
          finished();
        })        
      });
    });            
  }
});

















