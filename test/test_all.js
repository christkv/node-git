require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing", "./test");

var sys = require('sys');

// Run all tests
require('test_git').suite.runTests(function() {});
require('test_head').suite.runTests(function() {});
require('test_diff').suite.runTests(function() {});
require('test_file_index').suite.runTests(function() {});
require('test_commit').suite.runTests(function() {});
require('test_actor').suite.runTests(function() {});
require('test_blame').suite.runTests(function() {});
