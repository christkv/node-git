require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-compress",
  "./external-libs/node-async-testing", "./test");

var sys = require('sys');

// Diff tests
// require('diff/test_diff').suite.runTests(function() {});

// Run all tests
// require('test_head').suite.runTests(function() {});
// require('test_diff').suite.runTests(function() {});
// require('test_file_index').suite.runTests(function() {});
// require('test_commit').suite.runTests(function() {});
// require('test_actor').suite.runTests(function() {});
// require('test_blame').suite.runTests(function() {});
// require('test_blame_tree').suite.runTests(function() {});
// require('test_blob').suite.runTests(function() {});
// require('test_commit_stats').suite.runTests(function() {});
// require('test_commit_write').suite.runTests(function() {});
// require('test_config').suite.runTests(function() {});
// require('test_git').suite.runTests(function() {});
// require('test_index_status').suite.runTests(function() {});
// require('test_merge').suite.runTests(function() {});
// require('test_raw').suite.runTests(function() {});
// require('test_remote').suite.runTests(function() {});
// require('test_repo').suite.runTests(function() {});
// require('test_git_basic').suite.runTests(function() {});
// require('test_git_alt').suite.runTests(function() {});
require('test_git_index').suite.runTests(function() {});

