var GitObject = exports.GitObject = function() {}

GitObject.from_raw = function(raw_object, repository) {
  if(raw_object.type == "blob") {
    
  } else if(raw_object.type == "tree") {
    
  } else if(raw_object.type == "commit") {
    return Commit.from_raw(raw_object, repository);
  } else if(raw_object.type == "tag") {
    
  } else {
    throw "got invalid object-type";
  }
}