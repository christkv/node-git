var Git = exports.Git = function(git_directory) {
  var _git_diretory = git_directory;

  // Control access to internal variables
  Object.defineProperty(this, "git_directory", { get: function() { return _git_diretory; }, set: function(value) { _git_diretory = value; }, enumerable: true});    
}