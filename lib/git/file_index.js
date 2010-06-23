var sys = require('sys'),
  fs = require('fs');

var FileIndex = exports.FileIndex = function(repo_path, callback) {
  var _repo_path = repo_path;
  var _index_file = repo_path + "/file-index";
  var self = this;  
  // Set up internal index info
  var _sha_count = 0, _commit_index = {}, _commit_order = {}, _all_files = {};
  
  // Set up properites for instance
  Object.defineProperty(this, "repo_path", { get: function() { return _repo_path; }, enumerable: true});      
  Object.defineProperty(this, "index_file", { get: function() { return _index_file; }, enumerable: true});        
  // Other values that allow setting
  Object.defineProperty(this, "sha_count", { get: function() { return _sha_count; }, set: function(value) { _sha_count = value; }, enumerable: true});        
  Object.defineProperty(this, "commit_index", { get: function() { return _commit_index; }, set: function(value) { _commit_index = value; }, enumerable: true});        
  Object.defineProperty(this, "commit_order", { get: function() { return _commit_order; }, set: function(value) { _commit_order = value; }, enumerable: true});        
  Object.defineProperty(this, "all_files", { get: function() { return _all_files; }, set: function(value) { _all_files = value; }, enumerable: true});        
  
  fs.stat(_index_file, function(err, stat) {
    if(err) return callback(err, stat);
    
    if(stat.isFile() && stat.size < FileIndex.max_file_size) {
      read_index(self, _index_file, function(err, _index) {
        if(err) return callback(err, _index);
        
        // sys.puts("================================================================================")
        // sys.puts(JSON.stringify(_index))
        
        callback(null, _index);
      })
    } else {
      callback("index file not found", null);
    }
  });
}

// Chomp text removing end carriage returns
var chomp = function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}

var dirname = function(file_name) {
  var path_elements = file_name.split('/');
  // Otherwise we need to create the path going backwards (build a serial execution using simplifier to reverse build)
  // path_elements = path_elements.slice(0, path_elements.length - 1);
  // path_elements = path_elements.length == 1 ? ['/'] : path_elements; 
  path_elements.pop();
  
  // sys.puts(sys.inspect(path_elements))
  if(path_elements.length == 0) return ".";
  
  // return path_elements.length > 1 ? path_elements.join('/') : '/';
  
  return path_elements.join("/");
}

// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// TODO Needs to be async reading files in pieces and parsing them
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// Read and parse the file index for git
var read_index = function(file_index, _index_file, callback) {
  sys.puts("======================================== read_index: " + _index_file)
  var current_sha = null;

  fs.readFile(_index_file, 'ascii', function(err, data) {
    if(err) return callback(err, data);
    // Split the text into lines
    var lines = data.split("\n");
    // Iterate over all the lines
    for(var i = 0; i < lines.length; i++) {
      var line = lines[i];
      
      var shas = line.match(/^(\w{40})/);
      // If we have one or more shas
      if(shas) {
        // Fetch the current sha
        current_sha = shas.shift();
        // The rest of the sha's are parents
        file_index.commit_index[current_sha] = {files:[], parents:shas}
        file_index.commit_order[current_sha] = file_index.sha_count;
        file_index.sha_count = file_index.sha_count + 1;
      } else {
        var file_name = chomp(line);
        var tree = '';
        // Retrieve the directory name for the file passed in
        var dir = dirname(file_name);
        // Ensure it's not an empty line        
        if(line.length > 0) {
          sys.puts("original: " + file_name + " = " + dir)          
          // Split up the directory
          var dir_parts = dir.split("/");
          for(var j = 0; j < dir_parts.length; j++) {
            if(dir_parts[j] != '.') {
              tree = tree + part + '/'
              if(file_index.all_files[tree] == null) file_index.all_files[tree]  = [];
              file_index.all_files[tree].
            }
          }
          
          
          
          // 
          //  TODO TODO TODO
          //
          
        }                
      }
    }
    
    // Return the parsed index
    // callback(null, file_index);
  });  
}

// Max size for file index
FileIndex.max_file_size = 10000000;