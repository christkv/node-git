require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

var TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Git = require('git').Git;

var suite = exports.suite = new TestSuite("node-git tests");

/**
  Test basic node-git functionality
**/
suite.addTests({
  "Open a repository correctly": function(assert, finished) {
    // Basic setup
    var git = new Git("./dot_git");
    var commit_sha = '5e3ee1198672257164ce3fe31dea3e40848e68d5'
    var tree_sha = 'cd7422af5a2e0fff3e94d6fb1a8fff03b2841881'
    var blob_sha = '4232d073306f01cf0b895864e5a5cfad7dd76fce'

    sys.puts(JSON.stringify(git))

    
    finished();
  }
});






