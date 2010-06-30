var Head = require('git/head').Head,
  Git = require('git/git').Git,
  Commit = require('git/commit').Commit,
  fs = require('fs'),
  sys = require('sys'),
  Tree = require('git/tree').Tree,
  Blob = require('git/blob').Blob;

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

// Create a blob object
Repo.prototype.blob = function(id, callback) {
  callback(null, new Blob(this, id));
}

// Initialize a bare git repository at the given path
//  path: full path to the repo (traditionally ends with /<name>.git)
//  options: is any additional options to the git init command
//
// Examples
//  Repo.init_bare('/var/git/myrepo.git')  
//
// Return repo (newly created repo)
Repo.init_bare = function(path, git_options, repo_options, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  // Set variables to default values
  git_options = args.length ? args.shift() : {};  
  repo_options = repo_options ? repo_options : {};
  // Set up bare option
  git_options['bare'] = true;
  // Create a git object
  var git = new Git(path);
  // Create the directory
  git.fs_mkdir('..', function(err, result) {
    if(err) return callback(err, result);
    git.init(git_options, function(err, git) {
      if(err) return callback(err, git);
      callback(null, new Repo(path, repo_options, callback));
    })
  })
}

// Fork a bare git repository from this repo
//  path: is the full path of the new repo (traditionally ends with /<name>.git)
//  options: is additional options to the git clone command (:bare and :shared are true by default)
//
// Return repo (newly created forked repo)
Repo.prototype.fork_bare = function(path, options, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();  
  var self = this;
  // Set variables to default values
  options = args.length ? args.shift() : {};
  options['bare'] = true;
  options['shared'] = true;
  // Create a git object
  var git = new Git(path);
  git.fs_mkdir('..', function(err, result) {
    if(err) return callback(err, result);
    self.git.clone(options, self.path, path, function(err, result) {
      if(err) return callback(err, result);
      callback(null, new Repo(path, callback));
    })
  })  
}

// The diff from commit a to commit b, optionally restricted to the fiven file(s)
//  a: the base commit
//  b: the end commit
//  paths: optional list of file paths on which to restrict the diff
Repo.prototype.diff = function(a, b, paths, callback) {
  this.git.diff({}, a, b, '--', paths, callback);
}

// The commit diff for the given commit
//  commit: the commit name/id
//
// Returns array of diff objects
Repo.prototype.commit_diff = function(commit, callback) {
  Commit.diff(this, commit, callback);
}

// The list of alternates for this repo
//
// Returns array of string (pathnames of alternates)
Repo.prototype.alternates = function(callback) {
  var alternates_path = "objects/info/alternates";
  var self = this;
  
  this.git.fs_exist(alternates_path, function(err, result) {
    if(err) return callback(err, result);
    if(!result) return callback(null, []);
    self.git.fs_read(alternates_path, function(err, data) {
      if(err) return callback(err, data);
      callback(null, data.trim().split("\n"));
    })
  });
}

// Sets the alternates
//  alts: array of string paths representing the alternates
//
// Returns nothing
Repo.prototype.set_alternates = function(alts, callback) {
  // check all the entries
  for(var i = 0; i < alts.length; i++) {
    // Is sync underneath (to avoid to many files open)
    this.git.fs_exist(alts[i], function(err, result) {
      if(err) return callback(err, result);
      if(!result) return callback("could not set alternates. alternate path " + alts[i] + " must exist", null);
    })
  }
  
  if(alts.length == 0) {
    this.git.fs_write('objects/info/alternates', '', callback);
  } else {
    this.git.fs_write('objects/info/alternates', alts.join("\n"), callback);
  }  
}

// The commit log for a treeish
//
// Returns array of commits
Repo.prototype.log = function(commit, path, options, callback) {
  var args = Array.prototype.slice.call(arguments, 0);
  callback = args.pop();  
  var self = this;
  // Unpack variables
  commit = args.length ? args.shift() : 'master';
  path = args.length ? args.shift() : null;
  options = args.length ? args.shift() : {};
  // Merge in extra parameters
  options['pretty'] = "raw";
  // var arg = path ? [commit, '--', path] : [commit];
  // Extract the commits
  this.git.log(commit, path, options, function(err, commits) {
    if(err) return callback(err, commits);
    callback(null, Commit.list_from_string(self, commits))
  });  
}

// Returns a list of commits that is in other_repo but not in self
//
// Returns array of commits
Repo.prototype.commit_deltas_from = function(other_repo, reference, other_reference, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();  
  var self = this;
  // Unpack variables
  reference = args.length ? args.shift() : 'master';
  other_reference = args.length ? args.shift() : 'master';
  // Let's fetch revlist  
  self.git.rev_list({}, reference, function(err, rev_text) {
    if(err) return callback(err, rev_text);
    var repo_refs = rev_text.trim().split("\n");
    
    other_repo.git.rev_list({}, other_reference, function(err, other_rev_text) {
      if(err) return callback(err, other_rev_text);
      var other_repo_refs = other_rev_text.trim().split("\n");
      
      // Subtract the references from other references
      // create map for the array to avoid binary searches
      var repo_ref_map = {};
      repo_refs.forEach(function(line) { 
        repo_ref_map[line] = 1;
      });
      
      // Subtract one array from the other
      var intersection = other_repo_refs.filter(function(line) { return !repo_ref_map[line]; })
      // Returned commits
      var commits = [];
      // Process all the intersected values
      for(var i = 0; i < intersection.length; i++) {
        var ref = intersection[i];
        Commit.find_all(other_repo, ref, {max_count:1}, function(err, ref_commits) {
          commits.push(ref_commits[0]);
        })
      }
      
      // Return the commits
      callback(null, commits);
    })
  });    
}











