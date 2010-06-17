var sys = require('sys'),
  GitFileOperations = require('git/git_file_operations').GitFileOperations;

var Git = exports.Git = function(git_directory) {
  var _git_diretory = git_directory;
  // Control access to internal variables
  Object.defineProperty(this, "git_directory", { get: function() { return _git_diretory; }, set: function(value) { _git_diretory = value; }, enumerable: true});    
}

// Retrieve references
Git.prototype.refs = function(options, prefix, callback) {
  // Locate all files in underlying directories
  GitFileOperations.glob(this.git_directory, function(err, files) {
    sys.puts("=================================================================================");
    sys.puts(sys.inspect(files))
  });
}