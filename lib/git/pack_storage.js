var sys = require('sys');

var PackStorage = exports.PackStorage = function(file) {
  var _name = file, _cache = {};
  // Replace idx reference with pack
  if(file.match(/\.idx$/)) {
    file = file.substr(0, file.length - 3) + "pack";
  }
  
  Object.defineProperty(this, "name", { get: function() { return _name; }, set: function(value) { _name = value; }, enumerable: true});        
  Object.defineProperty(this, "cache", { get: function() { return _cache; }, set: function(value) { _cache = value; }, enumerable: true});        
  // Initialize pack
  init_pack(this);
}

var init_pack(pack) {
  // TODO TODO TODO
}