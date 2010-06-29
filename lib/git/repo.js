var Head = require('git/head').Head,
  Git = require('git/git').Git,
  Commit = require('git/commit').Commit,
  fs = require('fs'),
  sys = require('sys'),
  Tree = require('git/tree').Tree;

var Repo = exports.Repo = function(path, options, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  options = args.length ? args.shift() : {};  

  var _path = path;  
  var _options = options;
  var _working_directory = _path;
  var _bare = true;
  var _git = null;
  var epath = fs.realpathSync(path);
  // Create git object
  var self = this;  
  // Control access to internal variables
  Object.defineProperty(this, "path", { get: function() { return _path; }, enumerable: true});    
  Object.defineProperty(this, "options", { get: function() { return _options; }, enumerable: true});    
  Object.defineProperty(this, "git", { get: function() { return _git; }, enumerable: true});    
  Object.defineProperty(this, "bare", { get: function() { return _bare; }, enumerable: true});    
  Object.defineProperty(this, "working_directory", { get: function() { return _working_directory; }, enumerable: true});    
  
  // Todo checks on paths
  if(fs.stat(epath + "/.git", function(err, stat) {
    if(!err) {
      _working_directory = epath;
      _path = epath + "/.git";
      _bare = false;
      _git = new Git(_path);
      // Return the repo
      callback(null, self);
    } else {
      // Check if it's a bare or already is pointing to the .git directory
      fs.stat(epath, function(err, stat) {
        if(!err && stat.isDirectory() && (epath.match(/\.git$/) || options.is_bare)) {
          _path = epath;
          _bare = true;        
          _git = new Git(_path);
          // Return the repo
          callback(null, self);
        } else if(!err && stat.isDirectory()) {
          callback("invalid git repository", null);          
        } else {
          callback("no such path", null);          
        }
      });      
    }
  }));
}

// Fetch the current head
Repo.prototype.head = function(callback) {
  Head.current(this, callback);
}

// Fetch the repo heads
Repo.prototype.heads = function(callback) {  
  Head.find_all(this, callback);
}

// Fetch a set of commits
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

// Fetch a specific commit
Repo.prototype.commit = function(id, callback) {
  var options = {max_count:1};
  // Locate commits and return the first one
  Commit.find_all(this, id, options, function(err, commits) {
    if(err) return callback(err, commits);
    callback(null, commits[0]);
  })
}

// Fetch the commit count based on a start reference
Repo.prototype.commit_count = function(start, callback) {
  start = start ? start : 'master';
  Commit.count(this, start, callback);
}

// Fetch a repository tree
Repo.prototype.tree = function(treeish, paths, callback) {
  var args = Array.prototype.slice.call(arguments, 0);
  callback = args.pop();
  // Set variables to default values
  treeish = args.length ? args.shift() : 'master';  
  paths = args.length ? args.shift() : [10];  
  // Construct the tree
  Tree.construct(this, treeish, paths, callback);
}















