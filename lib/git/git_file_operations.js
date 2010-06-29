var kiwi = require('kiwi');

// Initialize the seeds
kiwi.seed('simplify');

var sys = require('sys'),
  fs = require('fs'),
  Simplifier = require('simplifier').Simplifier,
  ParallelFlow = require('simplifier').ParallelFlow;

var GitFileOperations = exports.GitFileOperations = function() {}

// Streaming glob function
var streaming_glob_function = function(path, stream) {
  var entries = fs.readdirSync(path);
  entries.forEach(function(entry) {
    var entry_path = path + "/" + entry;    
    var stat = fs.statSync(entry_path);
    
    if(stat.isDirectory()) {
      stream.emit("data", {path:entry_path, stat:stat});
      streaming_glob_function(entry_path, stream);
    } else {
      stream.emit("data", {path:entry_path, stat:stat});
    }
  })
}

// Glob function for the file system
GitFileOperations.glob_streaming  = function(path) {
  // Create a stream object
  var stream = new process.EventEmitter();
  var processed_directories_count = 0;
  var top_level_files_count = -1;
  // Tick method
  var tick_function = function() {
    // If we are done emit end otherwise execute the method again
    processed_directories_count == top_level_files_count ? stream.emit("end") : process.nextTick(tick_function);
  }    
  // set nextTick handler into action
  process.nextTick(tick_function);  
  // Fetch the top directory
  fs.readdir(path, function(err, entries) {
    // The top level of files that need to be finished processing for us to be done
    top_level_files_count = entries.length;
    // Execute the entries
    for(var i = 0; i < entries.length; i++) {
      // Entry path
      var entry_path = path + "/" + entries[i];
      // Get the stat
      fs.stat(entry_path, function(err, stat) {
        if(stat.isDirectory()) {
          // Dive into the directory
          streaming_glob_function(entry_path, stream);
          // Emit the directory and then update the count
          stream.emit("data", {path:entry_path, stat:stat});
          processed_directories_count = processed_directories_count + 1;
        } else if(stat.isFile()) {
          // Update the number of processed directories and emit the data event
          stream.emit("data", {path:entry_path, stat:stat});
          processed_directories_count = processed_directories_count + 1;
        }
      });      
    }
  });  
  // Return the stream for execution
  return stream;
}

// Execute recursive glob function (private function)
var glob_function = function(path, files) {
  var entries = fs.readdirSync(path);
  entries.forEach(function(entry) {
    var entry_path = path + "/" + entry;
    
    var stat = fs.statSync(entry_path);
    if(stat.isDirectory()) {
      glob_function(entry_path, files);
    } else {
      files.push(entry_path);
    }
  })
}

// Glob function for the file system
GitFileOperations.glob  = function(path, files, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  files = args.length ? args.shift() : [];
  // Fetch all the files
  glob_function(path, files);
  callback(null, files);
}

// Read a file
GitFileOperations.fs_read = function(path, file, callback) {
  fs.readFile(path + "/" + file, callback);
} 

// Make a directory
GitFileOperations.fs_mkdir = function(dir, callback) {
  fs.mkdir(dir, 16877, callback);
}











