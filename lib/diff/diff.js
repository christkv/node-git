var sys = require('sys');

var Difference = exports.Difference = function() {
  
}

Difference.LCS = function() {
  
}

// Compute the longest common subsequence between the arrays a and b the result
// being an array whose content is such that they 
// count = 0
// result.forEach(function(e) {
//  if(e) a[count] == b[e];
//  count++; 
// })
Difference.LCS.__lcs = function(a, b) {
  sys.puts("========== __lcs = function()")
  var a_start = 0;
  var b_start = 0;
  var a_finish = a.length - 1;
  var b_finish = b.length - 1;
  var vector = [];
    
  // Remove common elements at the beginning
  while((a_start <= a_finish) && (b_start <= b_finish) && (a[a_start] == b[b_start])) {
    vector[a_start] = b_start;
    a_start = a_start + 1;
    b_start = b_start + 1;
  }
  
  // Remove common elements at the end
  while((a_start <= a_finish) && (b_start <= b_finish) && (a[a_finish] == b[b_finish])) {
    vector[a_finish] = b_finish;
    a_finish = a_finish - 1;
    b_finish = b_finish - 1;
  }
  
  // Now compute the equivalent classes of positions of elements
  var b_matches = Difference.LCS.__position_hash(b, b_start, b_finish);
  
  // Define treshold and links
  var thresh = [];
  var links = [];
  
  for(var ii = a_start; ii <= a_finish; ii++) {
    var ai = Array.isArray(a) ? a[ii] : a.charAt(ii);
    sys.puts(sys.inspect(b_matches))
    sys.puts("-------- ai: " + ai)
    
    var bm = b_matches[ai];
    bm = bm ? bm : [];
    var kk = null;
    
    bm.reverse().forEach(function(jj) {
      if(kk != null && (thresh[kk] > jj) && (thresh[kk - 1] < jj)) {
        thresh[kk] = jj;
      } else {
        kk = Difference.LCS.__replace_next_larger(thresh, jj, kk);
      }
      // Add link
      if(kk != null) links[kk] = [(kk > 0) ? links[kk - 1] : null, ii, jj];
    });
  }
  
  
}

Difference.LCS.__replace_next_larger = function(enumerable, value, last_index) {
  throw "::: TODO ::: Difference.LCS.__replace_next_larger not implemented"
}

Difference.LCS.__position_hash = function(enumerable, interval_start, interval_end) {
  // sys.puts("================ interval_start: " + interval_start)
  // sys.puts("================ interval_end: " + interval_end)  
  interval_start = interval_start ? interval_start : 0;
  interval_end = interval_end ? interval_end : -1;
  sys.puts(sys.inspect(enumerable))
  
  var hash = {}
  for(var i = interval_start; i <= interval_end; i++) {
    // sys.puts("=========== 1")
    var kk = Array.isArray(enumerable) ? enumerable[i] : enumerable.charAt(i);
    sys.puts("============ kk: " + kk)
    
    hash[kk] = Array.isArray(hash[kk]) ? hash[kk] : [];
    hash[kk].push(i);
  }
  // sys.puts(sys.inspect(hash))
  return hash;
}