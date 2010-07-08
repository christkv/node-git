var sys = require('sys'),
  Submodule = require('git/sub_module').Submodule;

var Tree = exports.Tree = function(repo, id, mode, name, contents) {
  var _repo = repo, _id = id, _contents = contents, _mode = mode, _name = name;

  // Internal properties
  Object.defineProperty(this, "repo", { get: function() { return _repo; }, set: function(value) { _repo = value; }, enumerable: true});    
  Object.defineProperty(this, "id", { get: function() { return _id; }, set: function(value) { _id = value; }, enumerable: true});    
  Object.defineProperty(this, "mode", { get: function() { return _mode; }, set: function(value) { _mode = value; }, enumerable: true});    
  Object.defineProperty(this, "name", { get: function() { return _name; }, set: function(value) { _name = value; }, enumerable: true});    
  Object.defineProperty(this, "contents", { get: function() { return _contents; }, set: function(value) { _contents = value; }, enumerable: true});      
}

// Construct the contents of the tree
// repo: the current rep
// treeish: the reference
// paths: optional array of directory paths to restrict the tree
Tree.construct = function(repo, treeish, paths, callback) {
  // Set the path to the default if it's null
  paths = paths ? paths : [];  
  // Run the ls_tree command
  repo.git.ls_tree({}, treeish, paths, function(err, output) {
    if(err) return callback(err, output);
    construct_initialize(repo, treeish, output, callback);
  });  
}

// Create a new instance of the tree class
var construct_initialize = function(repo, id, text, callback) {
  // Create a tree object
  var tree = new Tree(repo, id, null, null, []);  
  var lines = text.split("\n");
  // Fetch all the lines
  for(var i = 0; i < lines.length; i++) {
    content_from_string(repo, lines[i], function(err, entry) {
      if(err) return callback(err, entry);
      tree.contents.push(entry);      
    });        
  }  

  // Remove all the null entries
  tree.contents = tree.contents.filter(function(entry) { return entry ? true : false; });
  // Return the object
  callback(null, tree);
}

var content_from_string = function(repo, text, callback) {
  // Split the text into parts and extract the variables
  var parts = text.replace(/\t/, ' ').split(" ", 4);
  var mode = parts[0];
  var type = parts[1];
  var id = parts[2];
  var name = parts[3];
  
  if(type == "tree") {
    callback(null, new Tree(repo, id, mode, name));
  } else if(type == "blob") {
    callback(null, new Blob(repo, id, mode, name));
  } else if(type == "link") {
    callback(null, new Blob(repo, id, mode, name));
  } else if(type == "commit") {
    callback(null, new Submodule(repo, id, mode, name));
  } else {
    callback("invalid type: " + type, null);
  } 
}











