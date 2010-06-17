var sys = require('sys'),
  Commit = require('git/commit').Commit;

var Head = exports.Head = function(name, commit) {
  var _name = name;
  var _commit = commit;  
  // Define the properties
  Object.defineProperty(this, "name", { get: function() { return _name; }, enumerable: true});
  Object.defineProperty(this, "commit", { get: function() { return _commit; }, enumerable: true});
}

var prefix = function(name) { 
    name = name ? name : '';
    return "refs/" + name.replace(/^.*::/g, '').toLowerCase() + "s"; 
  }

Head.find_all = function(repo, options, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  options = args.length ? args.shift() : {};

  // Let's fetch the references
  repo.git.refs({}, prefix(), function(err, refs) {
    var mapped_refs = refs.split(/\n/).map(function(ref) {
      // Fetch the name and id for the reference
      var split_reference = ref.split(/ /);
      var name = split_reference[0];
      var id = split_reference[1];
      // Create a commit object wit the id
      var commit = new Commit(repo, {id:id});
      // Wrap the commit object in a head object and return mapped object
      return new Head(name, commit);
    })
    
    sys.puts("===========================================================================");
    sys.puts(sys.inspect(mapped_refs));
    callback(null, mapped_refs);
  })

  sys.puts("========= head.find_all")
  
}