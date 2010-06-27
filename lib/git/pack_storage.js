var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  BinaryParser = require('git/binary_parser').BinaryParser,
  FileWindow = require('git/file_window').FileWindow;

var PACK_IDX_SIGNATURE = '\xfftOc';
var FAN_OUT_COUNT = 256;
var IDX_OFFSET_SIZE = 4;
var OFFSET_SIZE = 4;
var OFFSET_START = FAN_OUT_COUNT * IDX_OFFSET_SIZE;
var SHA1_SIZE = 20;
var CRC_SIZE = 4;
var SHA1_START = OFFSET_START + OFFSET_SIZE;
var ENTRY_SIZE = OFFSET_SIZE + SHA1_SIZE;
var ENTRY_SIZE_V2 = SHA1_SIZE + CRC_SIZE + OFFSET_SIZE;


var PackStorage = exports.PackStorage = function(file) {
  var _name = file, _cache = {}, _version = null, _offsets = null, _size = 0;
  // Replace idx reference with pack
  if(file.match(/\.idx$/)) {
    file = file.substr(0, file.length - 3) + "pack";
  }
  
  Object.defineProperty(this, "name", { get: function() { return _name; }, set: function(value) { _name = value; }, enumerable: true});        
  Object.defineProperty(this, "cache", { get: function() { return _cache; }, set: function(value) { _cache = value; }, enumerable: true});        
  Object.defineProperty(this, "version", { get: function() { return _version; }, set: function(value) { _version = value; }, enumerable: true});        
  Object.defineProperty(this, "offsets", { get: function() { return _offsets; }, set: function(value) { _offsets = value; }, enumerable: true});        
  Object.defineProperty(this, "size", { get: function() { return _size; }, set: function(value) { _size = value; }, enumerable: true});        
  // Initialize pack
  init_pack(this);
}

// Search for a sha1 in the pack
PackStorage.prototype.find = function(sha1) {
  sys.puts("===== PackStorage.prototype.find = function(sha1)")
  // If we have the object in the cache return it
  if(this.cache[sha1]) return this.cache[sha1];
  
  // We need to search for the object in the pack file
  var offset = find_object(this, sha1);
  // If no object found return null
  if(!offset) return null;
  // Parse the object at the located offset
  var obj = parse_object(offset);
  this.cache[sha1] = obj;
  return obj;
}

var find_object_in_index = function(pack, idx, sha1) {
  // Parse the first value of the sha as an index
  var slot = sha1.charCodeAt(0);
  if(!slot) return null;
  // Unpack the variables
  var first = pack.offsets[slot];
  var last = pack.offsets[slot + 1];
  
  while(first < last) {
    var mid = parseInt((first + last) / 2);    
    // If we have a version 2 pack file
    if(pack.version == 2) {
      // Fetch the sha1
      var midsha1 = idx.index([(OFFSET_START + (mid * SHA1_SIZE)), SHA1_SIZE]);      
      var compare_sha1 = '';
      // Convert midsha1 to allow for correct string comparision
      for(var i = 0; i < midsha1.length; i++) {
        compare_sha1 = compare_sha1 + String.fromCharCode(midsha1[i]);
      }
        
      // Do a locale Compare
      var cmp = compare_sha1.localeCompare(sha1);
      if(cmp < 0) {
        first = mid + 1;        
      } else if(cmp > 0) {
        last = mid;
      } else {
        var pos = OFFSET_START + (pack.size * (SHA1_SIZE + CRC_SIZE)) + (mid * OFFSET_SIZE);
        var offset = idx.index([pos, OFFSET_SIZE]);
        offset = BinaryParser.toInt(reverse_buffer(offset).toString('binary', 0, 4));
        return offset;
      }
    } else {
      var midsha1 = idx.index([SHA1_START + mid * ENTRY_SIZE, SHA1_SIZE]);
      var compare_sha1 = '';
      // Convert midsha1 to allow for correct string comparision
      for(var i = 0; i < midsha1.length; i++) {
        compare_sha1 = compare_sha1 + String.fromCharCode(midsha1[i]);
      }

      // Do a locale Compare
      var cmp = compare_sha1.localeCompare(sha1);
      if(cmp < 0) {
        first = mid + 1;        
      } else if(cmp > 0) {
        last = mid;
      } else {
        var pos = OFFSET_START + mid * ENTRY_SIZE;
        var offset = idx.index([pos, OFFSET_SIZE]);
        offset = BinaryParser.toInt(reverse_buffer(offset).toString('binary', 0, 4));
        return offset;
      }      
    }
  }  
}

var find_object = function(pack, sha1) {
  var obj = null;
  // Should I not use the cached version in the future ? TODO
  with_idx(pack, function(err, idx) {    
    obj = find_object_in_index(pack, idx, sha1);
  })
  
  return obj;
}

var reverse_buffer = function(buffer) {
  var result_buffer = new Buffer(buffer.length);
  var length = buffer.length;
  
  for(var i = 0; i < length; i++) {
    result_buffer[length - 1 - i] = buffer[i];
  }
  
  return result_buffer;
}

var init_pack = function(pack) {
  // TODO TODO TODO
  with_idx(pack, function(err, idx) {
    // Reset pack offsets
    pack.offsets = [0];
    // Do a max of FAN_OUT_COUNT to avoid going crazy
    for(var i = 0; i < FAN_OUT_COUNT; i++) {
      // Each offset value is a 4 byte network encoded integer
      var pos = idx.index([i * IDX_OFFSET_SIZE, IDX_OFFSET_SIZE])
      pos = BinaryParser.toInt(reverse_buffer(pos).toString('binary', 0, 4));
      
      // If the position is less than the pack offset stored the pack index is corrupt
      if(pos < pack.offsets[i]) {
        throw "pack " + pack.name + " has discontinuous index " + i;
      }
      // Add offset position to list of tracked offsets
      pack.offsets.push(pos);
    }
    // Adjust the pack size
    pack.size = pack.offsets[pack.offsets.length - 1];
    // Close all files
    idx.close();
  });
}

var with_idx = function(pack, index_file, callback) {
  var args = Array.prototype.slice.call(arguments, 1);
  callback = args.pop();
  index_file = args.length ? args.shift() : null;
  // Define file handle variable
  var idxfile = null;
  
  if(!index_file) {
    index_file = pack.name;    
    sys.puts(pack.name.substr(0, pack.name.length - 4) + "idx")
    idxfile = fs.openSync(pack.name.substr(0, pack.name.length - 4) + "idx", "r");
  } else {
    idxfile = fs.openSync(index_file, "r");
  }
  
  // Read header
  var sign_buffer = new Buffer(4);
  var signature = '';
  fs.readSync(idxfile, sign_buffer, 0, 4);
  for(var i = 0; i < sign_buffer.length;  i++) {
    signature = signature + BinaryParser.fromByte(sign_buffer[i]);
  }
  
  // Extract version of pack
  var ver_buffer = new Buffer(4);
  fs.readSync(idxfile, ver_buffer, 0, 4);
  var ver = BinaryParser.toInt(reverse_buffer(ver_buffer).toString('binary', 0, 4));
  // If we have a IDX pack signature this is at least version 2 of the file format
  if(signature == PACK_IDX_SIGNATURE) {
    if(ver != 2) {
      fs.closeSync(idxfile);      
      throw ("pack " + pack.name + " has unknown pack file version " + ver);
    }
    pack.version = 2;
  } else {
    pack.version = 1;
  }
  // Create a file window and return it
  var idx = new FileWindow(idxfile, pack.version);
  callback(null, idx);
}