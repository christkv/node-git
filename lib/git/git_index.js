var sys = require('sys'),
  Tree = require('git/tree').Tree;

var GitIndex = exports.GitIndex = function(repo) {  
  var _repo = repo, _tree = {}, _current_tree = null;
  
  Object.defineProperty(this, "tree", { get: function() { return _tree; }, set: function(value) { _tree = value; }, enumerable: true});    
  Object.defineProperty(this, "current_tree", { get: function() { return _current_tree; }, set: function(value) { _current_tree = value; }, enumerable: true});    
  Object.defineProperty(this, "repo", { get: function() { return _repo; }, set: function(value) { _repo = value; }, enumerable: true});  
}

// Sets the current tree
//  +tree+ the branch/tag/sha... to use - a string
// 
// Returns index (self)
GitIndex.prototype.read_tree = function(tree, callback) {
  sys.puts("GitIndex.prototype.read_tree = function(tree, callback)")
  var self = this;
  // Load the tree
  this.repo.tree(tree, function(err, loaded_tree) {
    if(err) return callback(err, loaded_tree);
    self.current_tree = loaded_tree;
    callback(null, loaded_tree);
  })
}

// Add a file to the index
//   +path+ is the path (including filename)
//   +data+ is the binary contents of the file
//
// Returns nothing
GitIndex.prototype.add = function(file_path, data) {
  var path = file_path.split('/');
  var filename = path.pop();  
  var current = this.tree;
  
  path.forEach(function(dir) {
    current[dir] = current[dir] || {};
    var node = current[dir];
    current = node;
  });
    
  current[filename] = data;
}

// Commit the contents of the index
//   +message+ is the commit message [nil]
//   +parents+ is one or more commits to attach this commit to to form a new head [nil]
//   +actor+ is the details of the user making the commit [nil]
//   +last_tree+ is a tree to compare with - to avoid making empty commits [nil]
//   +head+ is the branch to write this head to [master]
//
// Returns a String of the SHA1 of the commit
GitIndex.prototype.commit = function(message, parents, actor, last_tree, head, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  // Set variables to default values
  parents = args.length ? args.shift() : null;  
  actor = args.length ? args.shift() : null;  
  last_tree = args.length ? args.shift() : null;  
  head = args.length ? args.shift() : 'master';  
  
  this.write_tree(this.tree, this.current_tree, function(err, tree_sha1) {
    
  });
}

var to_bin = function(sha1o) {
  var sha1 = '';
  for(var i = 0; i < sha1o.length; i = i + 2) {
    sha1 = sha1 + String.fromCharCode(parseInt(sha1o.substr(i, 2), 16));
  }  
  return sha1;
}

// Recursively write a tree to the index
//   +tree+ is the tree
//
// Returns the SHA1 String of the tree
GitIndex.prototype.write_tree = function(tree, now_tree, callback) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  // Set variables to default values
  now_tree = args.length ? args.shift() : null;  
  
  // Holds the tree content
  var tree_contents = {};
  
  // Fill in the original tree
  if(now_tree) {
    now_tree.contents.forEach(function(obj) {
      var sha = to_bin(obj.id);
      var k = obj.name;
      
      if(obj instanceof Tree) k = k + '/';
      tree_contents[k] = "" + obj.mode.toString() + " " + obj.name + "\0" + sha;
    });
  }
  
  // sys.puts("======================= hel// lo " + sys.inspect(Object.keys(tree_contents)))
  // sys.puts("======================= hello " + sys.inspect(Object.keys(tree_contents)))
  
  // sys.puts(sys.inspect(tree))
  
  // overwrite with the new tree contents
  Object.keys(tree).forEach(function(key) {
    var value = tree[key];
    sys.puts("------------------------------------------------------------------------ 1")
    
    if(value.constructor == String) {
      sys.puts("==================== 1")
      var sha = self.write_blob(value);
      sys.puts("==================== 2")
      var sha = to_bin(sha);
      tree_contents[key] = "" + '100644' + " " + k + "\0" + sha;
    } else if(Object.prototype.toString.call(value) === '[object Object]') {      
      sys.puts("==================== 2")
      var ctree = now_tree ? (now_tree.find(key)) : null;
      
      sys.puts("==================== 3")
    }
  })
  
  sys.puts("========================================================================= 2")
}

// Write the blob to the index
//   +data+ is the data to write
//
// Returns the SHA1 String of the blob
GitIndex.prototype.write_blob = function(data) {  
  this.repo.git.put_raw_object(data, 'blob');
}





















