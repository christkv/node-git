var kiwi = require('kiwi');

// Initialize the seeds
kiwi.seed('simplify');

var sys = require('sys'),
  fs = require('fs'),
  Simplifier = require('simplifier').Simplifier,
  ParallelFlow = require('simplifier').ParallelFlow;

var GitFileOperations = exports.GitFileOperations = function() {}

// Collect stat 
var fetch_directory = function(path, files) {  
  return function(callback) {
    // Grab the stat for the file
    fs.stat(path, function(err, result) {
      if(!result.isDirectory()) {
        files.push(path);
        return callback(null, []);
      }
      // It's a directory let's walk the tree
      GitFileOperations.glob(path, files, function(err, new_files) {
        callback(null, new_files);
      });              
    });    
  }
}

GitFileOperations.glob = function(path, files, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  files = args.length ? args.shift() : [];
  
  fs.readdir(path, function(err, dir_files) {
    // Contains all the functions to be executed in parallel
    var fetch_directory_functions = [];
    // Create functions for each file to ensure we get proper callback
    dir_files.forEach(function(entry) {
      fetch_directory_functions.push(fetch_directory(path + "/" + entry, files));
    }); 
    
    new Simplifier().execute(new ParallelFlow(fetch_directory_functions), function() {
      // Return the collected files
      callback(null, files);
    });
  });
}