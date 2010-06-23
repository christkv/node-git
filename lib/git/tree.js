var Tree = exports.Tree = function(repo, id, text) {
  var _repo = repo, _id = id, _text = text;

  // Internal properties
  Object.defineProperty(this, "repo", { get: function() { return _repo; }, enumerable: true});    
  Object.defineProperty(this, "id", { get: function() { return _id; }, enumerable: true});    
  Object.defineProperty(this, "text", { get: function() { return _text; }, enumerable: true});      
}