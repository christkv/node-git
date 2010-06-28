var RawObject = exports.RawObject = function(type, content) {
  var _type = type, _content = content;
  
  Object.defineProperty(this, "type", { get: function() { return _type; }, set: function(value) { _type = value; }, enumerable: true});    
  Object.defineProperty(this, "content", { get: function() { return _content; }, set: function(value) { _content = value; }, enumerable: true});      
}