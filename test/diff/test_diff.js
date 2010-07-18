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

var __balanced_callback = function() {
  var callback = new Object();
  callback.result = '';
  callback.reset = function() { this.result = '' }
  callback.match = function(event) { this.result += "M" + event.old_position.toString() + event.new_position.toString() + " "; }
  callback.discard_a = function(event) { this.result += "DA" + event.old_position.toString() + event.new_position.toString() + " "; }
  callback.discard_b = function(event) { this.result += "DB" + event.old_position.toString() + event.new_position.toString() + " "; }
  callback.change = function(event) { this.result += "C" + event.old_position.toString() + event.new_position.toString() + " "; }
  callback.reset();
  return callback;
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
  "Should correctly execute lcs diff":function(assert, finished) {
    var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
    var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
    var correct_lcs = ["b", "c", "e", "j", "l", "m"];
    var res = null
    var ares = [];
    var bres = [];
    
    // Execute lcs over two arrays
    res = Difference.LCS.__lcs(seq1, seq2);
    // The result of the LCS (less the null values) must be as long as the
    // correct result.
    var res_compact = res.filter(function(e) { return e != null;});
    assert.equal(correct_lcs.length, res_compact.length);
    // Check that the values are correct
    for(var i = 0; i < res.length; i++) { assert.ok(res[i] == null || (seq1[i] == seq2[res[i]]));}
    for(var i = 0; i < res.length; i++) { ares[i] = res[i] != null ? seq1[i] : null; }    
    for(var i = 0; i < res.length; i++) { bres[i] = res[i] != null ? seq2[res[i]] : null; }
  
    assert.deepEqual(correct_lcs, ares.filter(function(e) { return e != null; }));
    assert.deepEqual(correct_lcs, bres.filter(function(e) { return e != null; }));
    
    res = Difference.LCS.LCS(seq1, seq2);
    assert.deepEqual(correct_lcs, res.filter(function(e) { return e != null; }));
    finished();
  },
  
  "Should correctly traverse sequences":function(assert, finished) {
    var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
    var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
    var correct_lcs = ["b", "c", "e", "j", "l", "m"];
    var skipped_seq1 = 'a h n p';
    var skipped_seq2 = 'd f k r s t';
    
    // Let's create a callback object
    var callbacks = __simple_callbacks();
    delete callbacks.finished_a;
    delete callbacks.finished_b;
    // Traverse the sequences
    Difference.LCS.traverse_sequences(seq1, seq2, callbacks);
    assert.equal(correct_lcs.length, callbacks.matched_a.length);
    assert.equal(correct_lcs.length, callbacks.matched_b.length);
    assert.equal(skipped_seq1, callbacks.discards_a.join(" "));
    assert.equal(skipped_seq2, callbacks.discards_b.join(" "));
    
    callbacks = __simple_callbacks();
    Difference.LCS.traverse_sequences(seq1, seq2, callbacks);
    assert.equal(correct_lcs.length, callbacks.matched_a.length);
    assert.equal(correct_lcs.length, callbacks.matched_b.length);
    assert.equal(skipped_seq1, callbacks.discards_a.join(" "));
    assert.equal(skipped_seq2, callbacks.discards_b.join(" "));
    assert.equal(9, callbacks.done_a[0][1]);
    assert.ok(callbacks.done_b[0] == null)
    finished();
  },
  
  "Should correctly execute diff":function(assert, finished) {
    var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
    var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
    // Correct diff result
    var _correct_diff = [[ [ '-',  0, 'a' ] ], [ [ '+',  2, 'd' ] ], [ [ '-',  4, 'h' ], [ '+',  4, 'f' ] ], [ [ '+',  6, 'k' ] ],
                  [ [ '-',  8, 'n' ], [ '-',  9, 'p' ], [ '+',  9, 'r' ], [ '+', 10, 's' ], [ '+', 11, 't' ] ] ]
    // Map the result
    var correct_diff = __map_diffs(_correct_diff, Difference.LCS.Change);
    var diff = Difference.LCS.diff(seq1, seq2);
    assert.equal(__format_diffs(correct_diff), __format_diffs(diff));
    assert.deepEqual(correct_diff, diff);
  
    finished();
  },
  
  "Should correctly handle empty diff":function(assert, finished) {
    var seqw = ["abcd", "efgh", "ijkl", "mnopqrstuvwxyz"];
    var correct_diff =  [
                      [ [ '-', 0, 'abcd'           ],
                        [ '-', 1, 'efgh'           ],
                        [ '-', 2, 'ijkl'           ],
                        [ '-', 3, 'mnopqrstuvwxyz' ] ] ];
    
    var diff = Difference.LCS.diff(seqw, []);
    assert.equal(__format_diffs(correct_diff), __format_diffs(diff));
    
    correct_diff = [
                      [ [ '+', 0, 'abcd'           ],
                        [ '+', 1, 'efgh'           ],
                        [ '+', 2, 'ijkl'           ],
                        [ '+', 3, 'mnopqrstuvwxyz' ] ] ];
    diff = Difference.LCS.diff([], seqw);
    assert.equal(__format_diffs(correct_diff), __format_diffs(diff));    
    finished();
  },
  
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
    var sdiff = Difference.LCS.sdiff(seq1, seq2);    
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly execute sdiff_b":function(assert, finished) {
    var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
    var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
    var correct_sdiff = [
                [ '-', [  0, 'a' ], [  0, null ] ],
                [ '=', [  1, 'b' ], [  0, 'b' ] ],
                [ '=', [  2, 'c' ], [  1, 'c' ] ],
                [ '+', [  3, null ], [  2, 'd' ] ],
                [ '=', [  3, 'e' ], [  3, 'e' ] ],
                [ '!', [  4, 'h' ], [  4, 'f' ] ],
                [ '=', [  5, 'j' ], [  5, 'j' ] ],
                [ '+', [  6, null ], [  6, 'k' ] ],
                [ '=', [  6, 'l' ], [  7, 'l' ] ],
                [ '=', [  7, 'm' ], [  8, 'm' ] ],
                [ '!', [  8, 'n' ], [  9, 'r' ] ],
                [ '!', [  9, 'p' ], [ 10, 's' ] ],
                [ '+', [ 10, null ], [ 11, 't' ] ] ];
      
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly execute sdiff_c":function(assert, finished) {
    var seq1 = ["a", "b", "c", "d", "e"];
    var seq2 = ["a", "e"];
    var correct_sdiff = [
                [ '=', [ 0, 'a' ], [ 0, 'a' ] ],
                [ '-', [ 1, 'b' ], [ 1, null ] ],
                [ '-', [ 2, 'c' ], [ 1, null ] ],
                [ '-', [ 3, 'd' ], [ 1, null ] ],
                [ '=', [ 4, 'e' ], [ 1, 'e' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
      
    assert.deepEqual(correct_sdiff, sdiff);
    finished();    
  },
  
  "Should correctly test sdiff_d":function(assert, finished) {
    var seq1 = ["a", "e"];
    var seq2 = ["a", "b", "c", "d", "e"];
    var correct_sdiff = [
                  [ '=', [ 0, 'a' ], [ 0, 'a' ] ],
                  [ '+', [ 1, null ], [ 1, 'b' ] ],
                  [ '+', [ 1, null ], [ 2, 'c' ] ],
                  [ '+', [ 1, null ], [ 3, 'd' ] ],
                  [ '=', [ 1, 'e' ], [ 4, 'e' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_e":function(assert, finished) {
    var seq1 = ["v", "x", "a", "e"];
    var seq2 = ["w", "y", "a", "b", "c", "d", "e"];
    var correct_sdiff = [
                    [ '!', [ 0, 'v' ], [ 0, 'w' ] ],
                    [ '!', [ 1, 'x' ], [ 1, 'y' ] ],
                    [ '=', [ 2, 'a' ], [ 2, 'a' ] ],
                    [ '+', [ 3, null ], [ 3, 'b' ] ],
                    [ '+', [ 3, null ], [ 4, 'c' ] ],
                    [ '+', [ 3, null ], [ 5, 'd' ] ],
                    [ '=', [ 3, 'e' ], [ 6, 'e' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_f":function(assert, finished) {
    var seq1 = ["x", "a", "e"];
    var seq2 = ["a", "b", "c", "d", "e"];
    var correct_sdiff = [
                      [ '-', [ 0, 'x' ], [ 0, null ] ],
                      [ '=', [ 1, 'a' ], [ 0, 'a' ] ],
                      [ '+', [ 2, null ], [ 1, 'b' ] ],
                      [ '+', [ 2, null ], [ 2, 'c' ] ],
                      [ '+', [ 2, null ], [ 3, 'd' ] ],
                      [ '=', [ 2, 'e' ], [ 4, 'e' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_g":function(assert, finished) {
    var seq1 = ["a", "e"];
    var seq2 = ["x", "a", "b", "c", "d", "e"];
    var correct_sdiff = [
                      [ '+', [ 0, null ], [ 0, 'x' ] ],
                      [ '=', [ 0, 'a' ], [ 1, 'a' ] ],
                      [ '+', [ 1, null ], [ 2, 'b' ] ],
                      [ '+', [ 1, null ], [ 3, 'c' ] ],
                      [ '+', [ 1, null ], [ 4, 'd' ] ],
                      [ '=', [ 1, 'e' ], [ 5, 'e' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_h":function(assert, finished) {
    var seq1 = ["a", "e", "v"];
    var seq2 = ["x", "a", "b", "c", "d", "e", "w", "x"];
    var correct_sdiff = [
                      [ '+', [ 0, null ], [ 0, 'x' ] ],
                      [ '=', [ 0, 'a' ], [ 1, 'a' ] ],
                      [ '+', [ 1, null ], [ 2, 'b' ] ],
                      [ '+', [ 1, null ], [ 3, 'c' ] ],
                      [ '+', [ 1, null ], [ 4, 'd' ] ],
                      [ '=', [ 1, 'e' ], [ 5, 'e' ] ],
                      [ '!', [ 2, 'v' ], [ 6, 'w' ] ],
                      [ '+', [ 3, null ], [ 7, 'x' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_i":function(assert, finished) {
    var seq1 = [];
    var seq2 = ["a", "b", "c"];
    var correct_sdiff = [
                      [ '+', [ 0, null ], [ 0, 'a' ] ],
                      [ '+', [ 0, null ], [ 1, 'b' ] ],
                      [ '+', [ 0, null ], [ 2, 'c' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_j":function(assert, finished) {
    var seq1 = ["a", "b", "c"];
    var seq2 = [];
    var correct_sdiff = [
                      [ '-', [ 0, 'a' ], [ 0, null ] ],
                      [ '-', [ 1, 'b' ], [ 0, null ] ],
                      [ '-', [ 2, 'c' ], [ 0, null ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_k":function(assert, finished) {
    var seq1 = ["a", "b", "c"];
    var seq2 = ["1"];
    var correct_sdiff = [
                      [ '!', [ 0, 'a' ], [ 0, '1' ] ],
                      [ '-', [ 1, 'b' ], [ 1, null ] ],
                      [ '-', [ 2, 'c' ], [ 1, null ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_l":function(assert, finished) {
    var seq1 = ["a", "b", "c"];
    var seq2 = ["c"];
    var correct_sdiff = [
                      [ '-', [ 0, 'a' ], [ 0, null ] ],
                      [ '-', [ 1, 'b' ], [ 0, null ] ],
                      [ '=', [ 2, 'c' ], [ 0, 'c' ] ]];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_m":function(assert, finished) {
    var seq1 = ["abcd", "efgh", "ijkl", "mnop"];
    var seq2 = [];
    var correct_sdiff = [
                      [ '-', [ 0, 'abcd' ], [ 0, null ] ],
                      [ '-', [ 1, 'efgh' ], [ 0, null ] ],
                      [ '-', [ 2, 'ijkl' ], [ 0, null ] ],
                      [ '-', [ 3, 'mnop' ], [ 0, null ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test sdiff_n":function(assert, finished) {
    var seq1 = [];
    var seq2 = ["abcd", "efgh", "ijkl", "mnop"];
    var correct_sdiff = [
                      [ '+', [ 0, null ], [ 0, 'abcd' ] ],
                      [ '+', [ 0, null ], [ 1, 'efgh' ] ],
                      [ '+', [ 0, null ], [ 2, 'ijkl' ] ],
                      [ '+', [ 0, null ], [ 3, 'mnop' ] ] ];
    correct_sdiff = __map_diffs(correct_sdiff);
    var sdiff = Difference.LCS.sdiff(seq1, seq2);
    assert.deepEqual(correct_sdiff, sdiff);
    finished();
  },
  
  "Should correctly test balanced a":function(assert, finished) {
    var seq1 = ["a", "b", "c"];
    var seq2 = ["a", "x", "c"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("M00 C11 M22 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced b":function(assert, finished) {
    var seq1 = ["a", "b", "c"];
    var seq2 = ["a", "x", "c"];
    var callback = __balanced_callback();
    // Remove the method change
    delete callback.change;
    
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("M00 DA11 DB21 M22 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced c":function(assert, finished) {
    var seq1 = ["a", "x", "y", "c"];
    var seq2 = ["a", "v", "w", "c"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("M00 C11 C22 M33 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced d":function(assert, finished) {
    var seq1 = ["x", "y", "c"];
    var seq2 = ["v", "w", "c"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("C00 C11 M22 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced e":function(assert, finished) {
    var seq1 = ["a", "x", "y", "z"];
    var seq2 = ["b", "v", "w"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("C00 C11 C22 DA33 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced f":function(assert, finished) {
    var seq1 = ["a", "z"];
    var seq2 = ["a"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("M00 DA11 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced g":function(assert, finished) {
    var seq1 = ["z", "a"];
    var seq2 = ["a"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("DA00 M10 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced h":function(assert, finished) {
    var seq1 = ["a", "b", "c"];
    var seq2 = ["x", "y", "z"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("C00 C11 C22 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced i":function(assert, finished) {
    var seq1 = ["abcd", "efgh", "ijkl", "mnopqrstuvwxyz"];
    var seq2 = [];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("DA00 DA10 DA20 DA30 ", callback.result);
    finished();
  },
  
  "Should correctly test balanced j":function(assert, finished) {
    var seq1 = [];
    var seq2 = ["abcd", "efgh", "ijkl", "mnopqrstuvwxyz"];
    var callback = __balanced_callback();
    Difference.LCS.traverse_balanced(seq1, seq2, callback);
    assert.equal("DB00 DB01 DB02 DB03 ", callback.result);
    finished();
  },
  
  "Should correctly test patch diff":function(assert, finished) {
    // var ps = null, ms1 = null, ms2 = null, ms3 = null;
    var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
    var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];
    
    var ps = Difference.LCS.diff(seq1, seq2);
    var ms1 = Difference.LCS.patch(seq1, ps);
    var ms2 = Difference.LCS.patch(seq2, ps, 'unpatch');
    var ms3 = Difference.LCS.patch(seq2, ps);
    
    assert.deepEqual(seq2, ms1);
    assert.deepEqual(seq1, ms2);
    assert.deepEqual(seq1, ms3);
    
    ps = Difference.LCS.diff(seq1, seq2, Difference.LCS.ContextDiffCallbacks);
    ms1 = Difference.LCS.patch(seq1, ps);
    ms2 = Difference.LCS.patch(seq2, ps, 'unpatch');
    ms3 = Difference.LCS.patch(seq2, ps);
    
    assert.deepEqual(seq2, ms1);
    assert.deepEqual(seq1, ms2);
    assert.deepEqual(seq1, ms3);
    
    ps = Difference.LCS.diff(seq1, seq2, Difference.LCS.SDiffCallbacks);
    ms1 = Difference.LCS.patch(seq1, ps);
    ms2 = Difference.LCS.patch(seq2, ps, 'unpatch');
    ms3 = Difference.LCS.patch(seq2, ps);

    assert.deepEqual(seq2, ms1);
    assert.deepEqual(seq1, ms2);
    assert.deepEqual(seq1, ms3);
    
    finished();    
  },
  
  "Should correctly do more patches":function(assert, finished) {
    // var s1 = null, s2 = null, s3 = null, s4 = null, s5 = null, ps = null;
    var s1 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
    var s2 = ["a", "b", "c", "d", "D", "e", "f", "g", "h", "i", "j", "k"];
    var ps = Difference.LCS.diff(s1, s2);
    var s3 = Difference.LCS.patch(s1, ps, 'patch');
    ps = Difference.LCS.diff(s1, s2, Difference.LCS.ContextDiffCallbacks);
    var s4 = Difference.LCS.patch(s1, ps, 'patch');
    ps = Difference.LCS.diff(s1, s2, Difference.LCS.SDiffCallbacks);
    var s5 = Difference.LCS.patch(s1, ps, 'patch');
    
    assert.deepEqual(s2, s3);
    assert.deepEqual(s2, s4);
    assert.deepEqual(s2, s5);
    
    ps = Difference.LCS.sdiff(s1, s2);
    s3 = Difference.LCS.patch(s1, ps, 'patch');
    ps = Difference.LCS.diff(s1, s2, Difference.LCS.ContextDiffCallbacks);
    s4 = Difference.LCS.patch(s1, ps, 'patch');
    ps = Difference.LCS.diff(s1, s2, Difference.LCS.DiffCallbacks)
    s5 = Difference.LCS.patch(s1, ps, 'patch');
    
    assert.deepEqual(s2, s3);
    assert.deepEqual(s2, s4);
    assert.deepEqual(s2, s5)
    finished();
  },
  
  "Should correctly patch with sdiff":function(assert, finished) {
    var seq1 = ["a", "b", "c", "e", "h", "j", "l", "m", "n", "p"];
    var seq2 = ["b", "c", "d", "e", "f", "j", "k", "l", "m", "r", "s", "t"];

    var ps = Difference.LCS.sdiff(seq1, seq2);
    var ms1 = Difference.LCS.patch(seq1, ps);
    var ms2 = Difference.LCS.patch(seq2, ps, 'unpatch');
    var ms3 = Difference.LCS.patch(seq2, ps);
    
    assert.deepEqual(seq2, ms1);
    assert.deepEqual(seq1, ms2);
    assert.deepEqual(seq1, ms3);
    
    ps = Difference.LCS.sdiff(seq1, seq2, Difference.LCS.ContextDiffCallbacks);
    ms1 = Difference.LCS.patch(seq1, ps);
    ms2 = Difference.LCS.patch(seq2, ps, 'unpatch');
    ms3 = Difference.LCS.patch(seq2, ps);
    
    assert.deepEqual(seq2, ms1);
    assert.deepEqual(seq1, ms2);
    assert.deepEqual(seq1, ms3);
    
    ps = Difference.LCS.sdiff(seq1, seq2, Difference.LCS.DiffCallbacks);
    ms1 = Difference.LCS.patch(seq1, ps);
    ms2 = Difference.LCS.patch(seq2, ps, 'unpatch');
    ms3 = Difference.LCS.patch(seq2, ps);
    
    assert.deepEqual(seq2, ms1);
    assert.deepEqual(seq1, ms2);
    assert.deepEqual(seq1, ms3);    
    finished();
  }
});

// Gotten from
var flatten = function(array) {
  return array.reduce(function(a,b) {  
    return a.concat(b);  
  }, []);
}














