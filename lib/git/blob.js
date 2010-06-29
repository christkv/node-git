var Blob = exports.Blob = function(repo, id, mode, name) {
  var _repo = repo, _id = id, _mode = mode, _name = name, _content = null;
  
  Object.defineProperty(this, "repo", { get: function() { return _repo; }, set: function(value) { _repo = value; }, enumerable: true});    
  Object.defineProperty(this, "id", { get: function() { return _id; }, set: function(value) { _id = value; }, enumerable: true});    
  Object.defineProperty(this, "mode", { get: function() { return _mode; }, set: function(value) { _mode = value; }, enumerable: true});      
  Object.defineProperty(this, "name", { get: function() { return _name; }, set: function(value) { _name = value; }, enumerable: true});    
  Object.defineProperty(this, "content", { get: function() { return _content; }, set: function(value) { _content = value; }, enumerable: true});    
}

// Retrieve the content of the blob
Blob.prototype.data = function(callback) {
  if(this._content) return callback(null, this._content);
  this.repo.git.cat_file('p', this.id, function(err, content) {
    this._content = content;
    callback(null, content);
  });
}

