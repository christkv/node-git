var Head = require('git/head').Head,
  Git = require('git/git').Git,
  Commit = require('git/commit').Commit;

var Repo = exports.Repo = function(path, options) {
  var _path = path;
  var _options = options;
  // Todo checks on paths
  // Create git object
  var _git = new Git(path);
  // Control access to internal variables
  Object.defineProperty(this, "path", { get: function() { return _path; }, enumerable: true});    
  Object.defineProperty(this, "options", { get: function() { return _options; }, enumerable: true});    
  Object.defineProperty(this, "git", { get: function() { return _git; }, enumerable: true});    
}

Repo.prototype.head = function(callback) {
  Head.current(this, callback);
}

Repo.prototype.heads = function(callback) {  
  Head.find_all(this, callback);
}

Repo.prototype.commits = function(start, max_count, skip, callback) {
  var args = Array.prototype.slice.call(arguments, 0);
  callback = args.pop();
  start = args.length ? args.shift() : 'master';  
  max_count = args.length ? args.shift() : 10;  
  skip = args.length ? args.shift() : 0;  
  
  var options = {max_count:max_count, skip:skip}
  // Locate all commits with the specified options
  Commit.find_all(this, start, options, callback);  
}