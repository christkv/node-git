var sys = require('sys'),
  fs = require('fs'),
  BinaryParser = require('git/binary_parser').BinaryParser,
  Zlib = require('zlib/zlib').Zlib,
  RawObject = require('git/raw_object').RawObject;

var OBJ_TYPES = [null, "commit", "tree", "blob", "tag"];

LooseStorage = exports.LooseStorage = function(directory) {
  var _directory = directory;

  Object.defineProperty(this, "directory", { get: function() { return _directory; }, set: function(value) { _directory = value; }, enumerable: true});    
}

LooseStorage.prototype.find = function(sha1) {
  try {
    sha1 = to_hex_string(sha1);
    // If we don't have a valid sha
    if(sha1.length != 40) return null;
    // Directory path
    var path = this.directory + "/" + sha1.substring(0, 2) + '/' + sha1.substring(2, 40);
    return this.get_raw_object(fs.readFileSync(path));    
  } catch(err) {
    return null;
  }
}

// Read and parse the raw object
LooseStorage.prototype.get_raw_object = function(buf) {
  if(buf.length < 2) throw "object file too small";

  // Set up variables
  var type = null;
  var size = null;
  var used = null;
  var content = null;

  if(this.is_legacy_loose_object(buf)) {
    content = new Zlib.Unzip(buf).unzip();
    content = Array.isArray(content) ? content[0] : content;
    // Let's split the content up
    var parts = content.split(/\0/)
    var header = parts.shift();
    content = parts.join("\0");
    
    // if no header or content we got an invalid object header
    if(header == null || content == null) throw "invalid object header";
    
    // Split out the header
    parts = header.split(/ /);
    type = parts[0];
    size = parts[1];
    // Check that we have a valid type
    if(['blob', 'tree', 'commit', 'tag'].indexOf(type) == -1 || !size.match(/^\d+$/)) throw "invalid object header";
    // Convert parts
    size = parseInt(size, 10);    
  } else {
    var parts = this.unpack_object_header_gently(buf);
    type = parts[0];
    size = parts[1];
    used = parts[2];
    // Unpack content
    content = new Zlib.Unzip(buf.slice(used, buf.length)).unzip();
    content = Array.isArray(content) ? content[0] : content;
  }
  // Return a raw object
  return new RawObject(type, content);
}

LooseStorage.prototype.unpack_object_header_gently = function(buf) {
  var used = 0
  var c = buf[used];
  used = used + 1;
  
  var type = (c >> 4) & 7;
  var size = c & 15;
  var shift = 4;
  
  while(c & 0x80 != 0) {
    if(buf.length <= used) throw "object file too short";
    // Get next char
    c = buf[used];
    used = used + 1;
    // Calculate size
    size = size + ((c & 0x7f) << shift);    
  }
  
  // Fetch the type
  type = OBJ_TYPES[type];
  // Check that we have a valid type
  if(['blob', 'tree', 'commit', 'tag'].indexOf(type) == -1) throw "invalid loose object type";
  return [type, size, used];
}

LooseStorage.prototype.is_legacy_loose_object = function(buf) {
  var word = (buf[0] << 8) + buf[1];
  return buf[0] == 0x78 && word % 31 == 0;
}

var to_hex_string = function(string) {
  var hexString = '';
  for(var index = 0; index < string.length; index++) {
    var value = BinaryParser.toByte(string.substr(index, 1));
    var number = value <= 15 ? "0" + value.toString(16) : value.toString(16);
    hexString = hexString + number;
  }
  return hexString;
};











