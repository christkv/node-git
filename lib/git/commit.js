var sys = require('sys'),
  Actor = require('git/actor').Actor,
  Tree = require('git/tree').Tree;

// Create a commit object
var Commit = exports.Commit = function(repo, id, parents, tree, author, authored_date, comitter, committed_date, message) {
  var _repo = repo, _id = id, _parents = parents, _tree = tree, _author = author, _authored_date = authored_date;
  var _comitter = comitter, _committed_date = committed_date;
  // Ensure we have an empty message at least
  message = message ? message : [];
  var _message = message.join("\n");
  // Extract short message
  var message_lines_filtered = message.filter(function(line) {
    return line.trim() == '' ? false : true;
  })
  var _short_message = message_lines_filtered.length > 0 ? message_lines_filtered[0] : '';
  
  // Internal properties
  Object.defineProperty(this, "repo", { get: function() { return _repo; }, enumerable: true});    
  Object.defineProperty(this, "id", { get: function() { return _id; }, enumerable: true});    
  Object.defineProperty(this, "parents", { get: function() { return _parents; }, enumerable: true});    
  Object.defineProperty(this, "tree", { get: function() { return _tree; }, enumerable: true});    
  Object.defineProperty(this, "author", { get: function() { return _author; }, enumerable: true});    
  Object.defineProperty(this, "authored_date", { get: function() { return _authored_date; }, enumerable: true});    
  Object.defineProperty(this, "comitter", { get: function() { return _comitter; }, enumerable: true});    
  Object.defineProperty(this, "committed_date", { get: function() { return _committed_date; }, enumerable: true});    
  Object.defineProperty(this, "message", { get: function() { return _message; }, enumerable: true});    
  Object.defineProperty(this, "short_message", { get: function() { return _short_message; }, enumerable: true});    
}

// Parse the actor and create the object
var actor = function(line) {
  var results = line.match(/^.+? (.*) (\d+) .*$/);
  var actor = results[1];
  var epoch = results[2];
  // Return the objects
  return [Actor.from_string(actor), new Date(parseInt(epoch) * 1000)]
}

var list_from_string = function(repo, text) {  
  // Split up the result
  var lines = text.split("\n");
  var commits = [];
  // Parse all commit messages
  while(lines.length > 0) {    
    var id = lines.shift().split(/ /).pop();
    var tree = new Tree(repo, lines.shift().split(/ /).pop());
    
    // Let's get the parents
    var parents = [];
    while(lines[0].match(/^parent/)) {
      parents.push(new Commit(repo, lines.shift().split(/ /).pop()))
    }
    // Let's get the author and committer
    var actor_info = actor(lines.shift());
    var author = actor_info[0];
    var authored_date = actor_info[1]
    var committer_info = actor(lines.shift());
    var comitter = committer_info[0];
    var committed_date = committer_info[1];
    // Unpack encoding
    var encoding = lines[0].match(/^encoding/) ? lines.shift().split().pop() : '';
    // Jump empty space
    lines.shift();    
    // Unpack message lines
    var message_lines = [];    
    while(lines[0].match(/^ {4}/)) {
      var message_line = lines.shift();
      message_lines.push(message_line.substring(4, message_line.length)) ;
    }
    
    // Move and point to next message
    while(lines[0] != null && lines[0] == '') lines.shift();
    // Create commit object
    commits.push(new Commit(repo, id, parents, tree, author, authored_date, comitter, committed_date, message_lines));
  }
  // Return all the commits
  return commits;
}

// Locate all commits for a give set of parameters
Commit.find_all = function(repo, reference, options, callback) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 2);
  callback = args.pop();
  options = args.length ? args.shift() : {};    
  
  // Merge the options with the default_options
  if(!options.pretty) options['pretty'] = 'raw';  
  // If we have a reference use that for the lookup
  if(!reference) option['all'] = true;
  // Locate revisions
  repo.git.rev_list(options, reference, function(err, revision_output) {
    if(err) return callback(err, []);
    // Turn string into a list of revisions
    callback(null, list_from_string(repo, revision_output));
  });
}

// Return the count of committs for a given start
Commit.count = function(repo, ref, callback) {
  repo.git.rev_list({}, ref, function(err, revision_output) {
    if(err) return callback(err, revision_output);
    callback(null, parseInt((revision_output.length/41)));
  })
}



















