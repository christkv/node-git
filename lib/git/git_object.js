var GitCommit = require('git/internal/git_commit').GitCommit,
  Tree = require('git/tree').Tree;

var GitObject = exports.GitObject = function() {}

GitObject.from_raw = function(raw_object, repository) {
  if(raw_object.type == "blob") {
    
  } else if(raw_object.type == "tree") {
    sys.puts("============================= create tree")    
    return Tree.from_raw(raw_object, repository);
  } else if(raw_object.type == "commit") {
    return GitCommit.from_raw(raw_object, repository);
  } else if(raw_object.type == "tag") {
    
  } else {
    throw "got invalid object-type";
  }
}