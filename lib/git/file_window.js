var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer;

var FileWindow = exports.FileWindow = function(idxfile, version) {
  var _idxfile = idxfile, _version = version, _global_offset, _offset = null;
  // Set file global offset
  _global_offset = version == 2 ? 8 : 0;
  //Internal properties
  Object.defineProperty(this, "idxfile", { get: function() { return _idxfile; }, set: function(value) { _idxfile = value; }, enumerable: true});
  Object.defineProperty(this, "version", { get: function() { return _version; }, enumerable: true});
  Object.defineProperty(this, "global_offset", { get: function() { return _global_offset; }, enumerable: true});
  Object.defineProperty(this, "offset", { get: function() { return _offset; }, set: function(value) { _offset = value; }, enumerable: true});
}

FileWindow.prototype.unmap = function() {
  this.idxfile = null;
}

FileWindow.prototype.index = function(idx) {
  var offset = null, len = null, seek_offset = null;
  
  if(idx.length == 1) idx = idx[0];
  // Number support
  if(idx.constructor == Number && idx === parseInt(value, 10)) {
    offset = idx;
    len = null;
  } else if(Array.isArray(idx)) {
    offset = idx[0];
    len = idx[1]
  } else {
    throw "invalid index param: " + sys.inspect(idx);
  }
  
  // Seek position equivalent using a position in the read
  if(this.offset != offset) {
    seek_offset = offset + this.global_offset;
  }
  
  if(!len) len = 1;    
  // Read the offset value
  var buffer = new Buffer(len);
  if(seek_offset) {    
    fs.readSync(this.idxfile, buffer, 0, len, seek_offset);
  } else {
    fs.readSync(this.idxfile, buffer, 0, len);    
  }
  return buffer;
} 

FileWindow.prototype.close = function() {
  fs.closeSync(this.idxfile);
  this.unmap();
}