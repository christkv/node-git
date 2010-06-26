LooseStorage = exports.LooseStorage = function(directory) {
  var _directory = directory;

  Object.defineProperty(this, "directory", { get: function() { return _directory; }, set: function(value) { _directory = value; }, enumerable: true});    
}