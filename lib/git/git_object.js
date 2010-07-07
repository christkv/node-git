var GitCommit = require('git/internal/git_commit').GitCommit,
  GitTree = require('git/internal/git_tree').GitTree;

var GitObject = exports.GitObject = function() {}

GitObject.from_raw = function(raw_object, repository) {  
  if(raw_object.type == "blob") {
    
  } else if(raw_object.type == "tree") {
    return GitTree.from_raw(raw_object, repository);
  } else if(raw_object.type == "commit") {
    return GitCommit.from_raw(raw_object, repository);
  } else if(raw_object.type == "tag") {
    
  } else {
    throw "got invalid object-type";
  }
}