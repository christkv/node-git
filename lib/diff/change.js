// Represents a simplistic (non-contextual) change. Represents the removal or
// addition of an element from either the old or the new sequenced enumerable.
var Change = exports.Change = function(action, position, element) {
  this.action = action;
  this.position = position;
  this.element = element;  
}

Change.from_a = function(arr) {
  return new Change(arr[0], arr[1], arr[2]);
}

Change.prototype.to_a = function() {
  return [this.action, this.position, this.element];
}

var ContextChange = exports.ContextChange = function(action, old_position, old_element, new_position, new_element) {
  this.action = action;
  this.old_position = old_position;
  this.old_element = old_element;
  this.new_position = new_position;
  this.new_element = new_element;
}

ContextChange.from_a = function(arr) {
  if(arr.length == 5) {
    return new ContextChange(arr[0], arr[1], arr[2], arr[3], arr[4]);
  } else {
    return new ContextChange(arr[0], arr[1][0], arr[1][1], arr[2][0], arr[2][1]);
  }
}

ContextChange.prototype.to_a = function() {
  return [this.action, [this.old_position, this.old_element], [this.new_position, this.new_element]];
}