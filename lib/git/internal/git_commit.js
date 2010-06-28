var sys = require('sys'), 
  UserInfo = require('git/user_info').UserInfo;

var GitCommit = exports.GitCommit = function(tree, parent, author, committer, message, headers, repository) {
  var _tree = tree, _parent = parent, _author = author, _committer = committer, _message = message, _headers = headers, _repository = repository;

  Object.defineProperty(this, "tree", { get: function() { return _tree; }, enumerable: true});    
  Object.defineProperty(this, "parent", { get: function() { return _parent; }, enumerable: true});    
  Object.defineProperty(this, "author", { get: function() { return _author; }, enumerable: true});    
  Object.defineProperty(this, "committer", { get: function() { return _committer; }, enumerable: true});    
  Object.defineProperty(this, "message", { get: function() { return _message; }, enumerable: true});    
  Object.defineProperty(this, "headers", { get: function() { return _headers; }, enumerable: true});    
  Object.defineProperty(this, "repository", { get: function() { return _repository; }, enumerable: true});      
  Object.defineProperty(this, "type", { get: function() { return "commit"; }, enumerable: true});      
}

// Create a commit from a raw object
GitCommit.from_raw = function(raw_object, repository) {
  var parent = [];
  var tree = null, author = null, committer = null;
  
  // Split the text but only grab the 2 first blocks
  var split_result = raw_object.content.split(/\n\n/, 2);
  var headers = split_result[0];
  var message = split_result[1];
  // get all the headers
  var all_headers = headers.split(/\n/).map(function(header) { 
    var parts = header.split(/ /);
    return [parts.shift(), parts.join(" ")];
  })
  // Iterate over all the headers
  all_headers.forEach(function(header) {
    var key = header[0];
    var value = header[1];
    
    if(key == "tree") {
      tree = value;
    } else if(key == "parent") {
      parent.push(value);
    } else if(key == "author") {
      author = new UserInfo(value);
    } else if(key == "committer") {
      committer = new UserInfo(value);
    } else {
      // Unknow header
      sys.puts("unknow header '" + key + "' in commit " + raw_object.sha_hex())
    }
  })
  
  if(!tree && !author && !committer) {
    throw "incomplete raw commit object";
  }  
  // Return the git commit object
  return new GitCommit(tree, parent, author, committer, message, headers, repository);
}

GitCommit.prototype.raw_log = function(sha1) {
  var output = "commit " + sha1 + "\n";
  output = output + this.headers + "\n\n";
  return output + this.message.split("\n").map(function(line) { return '    ' + line; }).join("\n") + "\n\n";
}












