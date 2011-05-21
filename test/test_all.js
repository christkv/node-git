require.paths.unshift("./lib", "./spec/lib", "./test");

module.exports = {};

var sys = require('sys');

// patch
var async_testing = require('async_testing');
var TestSuite = async_testing.TestSuite = function (name) {
    this.name = name;
    this.obj = {};
};
TestSuite.prototype.addTests = function (obj) {
    this.obj = obj;
    for(key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        obj[key] = (function(fun) {
            return function (test) {
                return fun(test, test.finish);
            };
        })(obj[key]);
    }
};

TestSuite.prototype.runTests = function (callback) {
    module.exports[this.name] = function () {
        async_testing.runSuite(this.obj, {name:this.name, onSuitDone:callback});
    };
};


// Diff tests
require('diff/test_diff').suite.runTests(function() {});

// Set max listeners
process.setMaxListeners(100);

// Run all tests
require('test_head').suite.runTests(function() {});
require('test_diff').suite.runTests(function() {});
require('test_file_index').suite.runTests(function() {});
require('test_commit').suite.runTests(function() {});
require('test_actor').suite.runTests(function() {});
require('test_blame').suite.runTests(function() {});
require('test_blame_tree').suite.runTests(function() {});
require('test_blob').suite.runTests(function() {});
require('test_commit_stats').suite.runTests(function() {});
require('test_commit_write').suite.runTests(function() {});
require('test_config').suite.runTests(function() {});
require('test_git').suite.runTests(function() {});
require('test_index_status').suite.runTests(function() {});
require('test_merge').suite.runTests(function() {});
require('test_raw').suite.runTests(function() {});
require('test_remote').suite.runTests(function() {});
require('test_repo').suite.runTests(function() {});
require('test_git_basic').suite.runTests(function() {});
require('test_git_alt').suite.runTests(function() {});
// require('test_git_index').suite.runTests(function() {});
require('test_git_iv2').suite.runTests(function() {});
require('test_submodule').suite.runTests(function() {});
require('test_tag').suite.runTests(function() {});
require('test_tree').suite.runTests(function() {});


if (module == require.main) {
  return require('async_testing').run(__filename, process.ARGV);
}

