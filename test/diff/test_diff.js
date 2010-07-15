require.paths.unshift("./spec/lib", "./lib", "./external-libs/node-httpclient/lib", "./external-libs/node-xml/lib",
  "./external-libs/node-async-testing");

TestSuite = require('async_testing').TestSuite,
  sys = require('sys'),
  Difference = require('diff/diff').Difference,
  ContextChange = require('diff/change').ContextChange,
  Change = require('diff/change').Change;

var suite = exports.suite = new TestSuite("diff tests");

var fixture = function(name, trim) {
  return trim ? fs.readFileSync("./test/fixtures/" + name, 'ascii').trim() : fs.readFileSync("./test/fixtures/" + name, 'ascii');
}

var __simple_callbacks = function() {
  var callbacks = {};
  callbacks.matched_a = null;
  callbacks.matched_b = null;
  callbacks.discards_a = null;
  callbacks.discards_b = null;
  callbacks.done_a = null;
  callbacks.done_b = null;
  
  callbacks.reset = function() {
    this.matched_a = [];
    this.matched_b = [];
    this.discards_a = [];
    this.discards_b = [];
    this.done_a = [];
    this.done_b = [];
  }
  
  callbacks.match = function(event) {
    this.matched_a.push(event.old_element);
    this.matched_b.push(event.new_element);
  }
  
  callbacks.discard_b = function(event) { this.discards_b.push(event.new_element); }  
  callbacks.discard_a = function(event) { this.discards_a.push(event.old_element); }  
  callbacks.finished_a = function(event) { this.done_a.push([event.old_element, event.old_position]); }  
  callbacks.finished_b = function(event) { this.done_b.push([event.new_element, event.new_position]); }
  
  callbacks.reset();
  return callbacks;
}

var __map_diffs = function(diffs, klass) {
  klass = klass ? klass : Difference.LCS.ContextChange;
  return diffs.map(function(chunks) {
    if(klass == Difference.LCS.ContextChange) {
      return klass.from_a(chunks);
    } else {
      return chunks.map(function(changes) { return klass.from_a(changes); });
    }
  });
}

var __format_diffs = function(diffs) {
  return diffs.map(function(e) {
    if(Array.isArray(e)) {
      return e.map(function(f) {
        if(Array.isArray(f)) {
          return f.join('')
        } else {
          return f.to_a().join('');          
        }
      }).join(", ");
    } else {
      return e.to_a().join();
    }
  }).join("; ");
}

suite.addTests({
  // "Should correctly execute lcs diff":function(assert, finished) {
  //   var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
  //   var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
  //   var correct_lcs = ["b", "c", "e", "j", "l", "m"];
  //   var res = null
  //   var ares = [];
  //   var bres = [];
  //   
  //   // Execute lcs over two arrays
  //   res = Difference.LCS.__lcs(seq1, seq2);
  //   // The result of the LCS (less the null values) must be as long as the
  //   // correct result.
  //   var res_compact = res.filter(function(e) { return e != null;});
  //   assert.equal(correct_lcs.length, res_compact.length);
  //   // Check that the values are correct
  //   for(var i = 0; i < res.length; i++) { assert.ok(res[i] == null || (seq1[i] == seq2[res[i]]));}
  //   for(var i = 0; i < res.length; i++) { ares[i] = res[i] != null ? seq1[i] : null; }    
  //   for(var i = 0; i < res.length; i++) { bres[i] = res[i] != null ? seq2[res[i]] : null; }
  // 
  //   assert.deepEqual(correct_lcs, ares.filter(function(e) { return e != null; }));
  //   assert.deepEqual(correct_lcs, bres.filter(function(e) { return e != null; }));
  //   
  //   res = Difference.LCS.LCS(seq1, seq2);
  //   assert.deepEqual(correct_lcs, res.filter(function(e) { return e != null; }));
  //   finished();
  // },
  // 
  // "Should correctly traverse sequences":function(assert, finished) {
  //   var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
  //   var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
  //   var correct_lcs = ["b", "c", "e", "j", "l", "m"];
  //   var skipped_seq1 = 'a h n p';
  //   var skipped_seq2 = 'd f k r s t';
  //   
  //   // Let's create a callback object
  //   var callbacks = __simple_callbacks();
  //   delete callbacks.finished_a;
  //   delete callbacks.finished_b;
  //   // Traverse the sequences
  //   Difference.LCS.traverse_sequences(seq1, seq2, callbacks);
  //   assert.equal(correct_lcs.length, callbacks.matched_a.length);
  //   assert.equal(correct_lcs.length, callbacks.matched_b.length);
  //   assert.equal(skipped_seq1, callbacks.discards_a.join(" "));
  //   assert.equal(skipped_seq2, callbacks.discards_b.join(" "));
  //   
  //   callbacks = __simple_callbacks();
  //   Difference.LCS.traverse_sequences(seq1, seq2, callbacks);
  //   assert.equal(correct_lcs.length, callbacks.matched_a.length);
  //   assert.equal(correct_lcs.length, callbacks.matched_b.length);
  //   assert.equal(skipped_seq1, callbacks.discards_a.join(" "));
  //   assert.equal(skipped_seq2, callbacks.discards_b.join(" "));
  //   assert.equal(9, callbacks.done_a[0][1]);
  //   assert.ok(callbacks.done_b[0] == null)
  //   finished();
  // },
  // 
  // "Should correctly execute diff":function(assert, finished) {
  //   var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
  //   var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
  //   // Correct diff result
  //   var _correct_diff = [[ [ '-',  0, 'a' ] ], [ [ '+',  2, 'd' ] ], [ [ '-',  4, 'h' ], [ '+',  4, 'f' ] ], [ [ '+',  6, 'k' ] ],
  //                 [ [ '-',  8, 'n' ], [ '-',  9, 'p' ], [ '+',  9, 'r' ], [ '+', 10, 's' ], [ '+', 11, 't' ] ] ]
  //   // Map the result
  //   var correct_diff = __map_diffs(_correct_diff, Difference.LCS.Change);
  //   var diff = Difference.LCS.diff(seq1, seq2);
  //   assert.equal(__format_diffs(correct_diff), __format_diffs(diff));
  //   assert.deepEqual(correct_diff, diff);
  // 
  //   finished();
  // },
  // 
  // "Should correctly handle empty diff":function(assert, finished) {
  //   var seqw = ["abcd", "efgh", "ijkl", "mnopqrstuvwxyz"];
  //   var correct_diff =  [
  //                     [ [ '-', 0, 'abcd'           ],
  //                       [ '-', 1, 'efgh'           ],
  //                       [ '-', 2, 'ijkl'           ],
  //                       [ '-', 3, 'mnopqrstuvwxyz' ] ] ];
  //   
  //   var diff = Difference.LCS.diff(seqw, []);
  //   assert.equal(__format_diffs(correct_diff), __format_diffs(diff));
  //   
  //   correct_diff = [
  //                     [ [ '+', 0, 'abcd'           ],
  //                       [ '+', 1, 'efgh'           ],
  //                       [ '+', 2, 'ijkl'           ],
  //                       [ '+', 3, 'mnopqrstuvwxyz' ] ] ];
  //   diff = Difference.LCS.diff([], seqw);
  //   assert.equal(__format_diffs(correct_diff), __format_diffs(diff));    
  //   finished();
  // },
  
  "Should correctly execute sdiff_a":function(assert, finished) {
    var seq1 = ["abc", "def", "yyy", "xxx", "ghi", "jkl"];
    var seq2 = ["abc", "dxf", "xxx", "ghi", "jkl"];
    var correct_sdiff = [
                    [ '=', [ 0, 'abc' ], [ 0, 'abc' ] ],
                    [ '!', [ 1, 'def' ], [ 1, 'dxf' ] ],
                    [ '-', [ 2, 'yyy' ], [ 2,  null  ] ],
                    [ '=', [ 3, 'xxx' ], [ 2, 'xxx' ] ],
                    [ '=', [ 4, 'ghi' ], [ 3, 'ghi' ] ],
                    [ '=', [ 5, 'jkl' ], [ 4, 'jkl' ] ] ];
                    
    var correct_sdiff = __map_diffs(correct_sdiff);
    // sys.puts("========================================== CORRECT SDIFF")
    // correct_sdiff.forEach(function(f) {
    //   sys.puts(sys.inspect(f.to_a()))
    // });
    var sdiff = Difference.LCS.sdiff(seq1, seq2);    
    // sys.puts("========================================== SDIFF")
    // sdiff.forEach(function(f) {
    //   sys.puts(sys.inspect(f.to_a()))
    // });
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  }

});

















