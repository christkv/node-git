require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing", "./test");

var sys = require('sys');

// Run all tests
// require('git_tests').suite.runTests(function() {});
// require('head_tests').suite.runTests(function() {});
// require('diff_tests').suite.runTests(function() {});
require('file_index_tests').suite.runTests(function() {});
