// This callback object implements the default set of callback events, which
// only returns the event itself. Note that //finished_a and //finished_b are
// not implemented -- I haven't yet figured out where they would be useful.
//
// Note that this is intended to be called as is, e.g.,
DefaultCallbacks = exports.DefaultCallbacks = function() {  
}

// Called when two items match.
DefaultCallbacks.prototype.match = function(event) {
  return event;
}

// Called when the old value is discarded in favour of the new value.
DefaultCallbacks.prototype.discard_a = function(event) {
  return event;
}

// Called when the new value is discarded in favour of the old value.
DefaultCallbacks.prototype.discard_b = function(event) {
  return event;
}

// Called when both the old and new values have changed.
DefaultCallbacks.prototype.change = function(event) {
  return event;
}

// An alias for DefaultCallbacks that is used in Diff::LCS#traverse_sequences.
SequenceCallbacks = exports.SequenceCallbacks = DefaultCallbacks;
// An alias for DefaultCallbacks that is used in Diff::LCS#traverse_balanced.
BalancedCallbacks = exports.BalancedCallbacks = DefaultCallbacks;

// This will produce a compound array of simple diff change objects. Each
// element in the //diffs array is a +hunk+ or +hunk+ array, where each
// element in each +hunk+ array is a single Change object representing the
// addition or removal of a single element from one of the two tested
// sequences. The +hunk+ provides the full context for the changes.
//
//     diffs = Diff::LCS.diff(seq1, seq2)
//       // This example shows a simplified array format.
//       // [ [ [ '-',  0, 'a' ] ],   // 1
//       //   [ [ '+',  2, 'd' ] ],   // 2
//       //   [ [ '-',  4, 'h' ],     // 3
//       //     [ '+',  4, 'f' ] ],
//       //   [ [ '+',  6, 'k' ] ],   // 4
//       //   [ [ '-',  8, 'n' ],     // 5
//       //     [ '-',  9, 'p' ],
//       //     [ '+',  9, 'r' ],
//       //     [ '+', 10, 's' ],
//       //     [ '+', 11, 't' ] ] ]
//
// There are five hunks here. The first hunk says that the +a+ at position 0
// of the first sequence should be deleted (<tt>'-'</tt>). The second hunk
// says that the +d+ at position 2 of the second sequence should be inserted
// (<tt>'+'</tt>). The third hunk says that the +h+ at position 4 of the
// first sequence should be removed and replaced with the +f+ from position 4
// of the second sequence. The other two hunks are described similarly.
//
// === Use
// This callback object must be initialised and is used by the Diff::LCS//diff
// method.
//
//     cbo = Diff::LCS::DiffCallbacks.new
//     Diff::LCS.LCS(seq1, seq2, cbo)
//     cbo.finish
//
// Note that the call to //finish is absolutely necessary, or the last set of
// changes will not be visible. Alternatively, can be used as:
//
//     cbo = Diff::LCS::DiffCallbacks.new { |tcbo| Diff::LCS.LCS(seq1, seq2, tcbo) }
//
// The necessary //finish call will be made.
//
// === Simplified Array Format
// The simplified array format used in the example above can be obtained
// with:
//
//     require 'pp'
//     pp diffs.map { |e| e.map { |f| f.to_a } }
DiffCallbacks = exports.DiffCallbacks = function(block) {
  this.hunk = [];
  this.diffs = [];
  
  if(block != null)  {
    block(this);
    this.finish();
  }
}

// Finalizes the diff process. If an unprocessed hunk still exists, then it
// is appended to the diff list.
DiffCallbacks.prototype.finish = function() {
  add_nonempty_hunk(this);
}

DiffCallbacks.prototype.match = function(empty) {
  add_nonempty_hunk(this);
}

DiffCallbacks.prototype.discard_a = function(event) {
  this.hunk.push(new Change('-', event.old_position, event.old_element));
}

DiffCallbacks.prototype.discard_b = function(event) {
  this.hunk.push(new Change('+', event.new_position, event.new_element));
}

var add_nonempty_hunk = function(diff_callback) {
  if(diff_callback.hunk.length > 0) diff_callback.diffs.push(diff_callback.hunk);
  diff_callback.hunk = [];
}











