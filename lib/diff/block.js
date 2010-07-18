// A block is an operation removing, adding, or changing a group of items.
// Basically, this is just a list of changes, where each change adds or
// deletes a single item. Used by bin/ldiff.
var Block = exports.Block = function(chunk) {
  this.changes = [];
  this.insert = [];
  this.remove = [];
  
  chunk.forEach(function(item) {
    this.changes.push(item);
    if(item.is_deleting()) this.remove.push(item);
    if(item.is_adding()) this.insert.push(item);
  })  
}

Block.prototype.diff_size = function() {
  return this.insert.length - this.remove.length;
}

Block.prototype.op = function() {
  var result = [this.remove.length == 0, this.insert.length == 0];
  
  if(!result[0] && !result[1]) {
    return "!";
  } else if(!result[0] && result[1]) {
    return "-";
  } else if(result[0] && result[1]) {
    return "+";
  } else {
    return "^";
  }
}