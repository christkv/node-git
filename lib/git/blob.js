var MimeTypes = require('git/mime/mime_types').MimeTypes;

var Blob = exports.Blob = function(repo, id, name, mode) {
  var _repo = repo, _id = id, _mode = mode, _name = name, _content = null, _data = null, _size = 0;
  
  Object.defineProperty(this, "repo", { get: function() { return _repo; }, set: function(value) { _repo = value; }, enumerable: true});    
  Object.defineProperty(this, "id", { get: function() { return _id; }, set: function(value) { _id = value; }, enumerable: true});    
  Object.defineProperty(this, "mode", { get: function() { return _mode; }, set: function(value) { _mode = value; }, enumerable: true});      
  Object.defineProperty(this, "name", { get: function() { return _name; }, set: function(value) { _name = value; }, enumerable: true});    
  Object.defineProperty(this, "content", { get: function() { return _content; }, set: function(value) { _content = value; }, enumerable: true});    

  // Data of the blob
  Object.defineProperty(this, "data", { get: function() { 
      _data = lazy_reader(_repo, _id, 'p', _data); 
      return _data;
    }, enumerable: false});

  // Size of the blob
  Object.defineProperty(this, "size", { get: function() { 
      _size = lazy_reader(_repo, _id, 's', _size); 
      return _size;
    }, enumerable: false});

  // Size of the blob
  Object.defineProperty(this, "mime_type", { get: function() { 
      var guesses = MimeTypes.type_for(_name);
      return Array.isArray(guesses) && guesses.length > 0 ? guesses[0].simplified : "text/plain";
    }, enumerable: false});
}

var lazy_reader = function(repo, id, type, variable) {
  if(variable) return variable;
  // Control the flow
  var done = false;
  var value = null;
  
  // Fetch the content
  repo.git.cat_file(type, id, function(err, content) {
    if(err) return done = true;
    value = content;
    done = true;
  })
  
  while(!done) {};
  return value;  
}


// Retrieve the content of the blob
Blob.prototype.data = function(callback) {
  if(this._content) return callback(null, this._content);
  this.repo.git.cat_file('p', this.id, function(err, content) {
    this._content = content;
    callback(null, content);
  });
}
