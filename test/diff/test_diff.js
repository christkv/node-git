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
    if(klass instanceof Difference.LCS.ContextChange) {
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
        return f.to_a().join('');
      }).join(", ");
    } else {
      return e.to_a.join();
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
  }

  // "Should correctly init gitdir":function(assert, finished) {
  //   var tmp_path = '/tmp/gitdir';
  //   GitFileOperations.fs_rmdir_r(tmp_path, function(err, result) {
  //     // Create a temp directory
  //     fs.mkdirSync(tmp_path, 16877);
  //     // create Git repo
  //     var git = new Git(tmp_path);
  //     git.init({}, function(err, git) {
  //       var stat = fs.statSync(tmp_path + "/config");
  //       assert.equal(true, stat.isFile());   
  //       finished();
  //     });      
  //   })
  // },
  // 
  // "Should correctly merge logs":function(assert, finished) {
  //   var c1 = '420eac97a826bfac8724b6b0eef35c20922124b7';
  //   var c2 = '30e367cef2203eba2b341dc9050993b06fd1e108';
  //   var git = new Git("./test/dot_git");
  //   
  //   git.rev_list({pretty:'raw', max_count:10}, 'master', function(err, rev_output) {
  //     assert.ok(rev_output.match("commit " + c1));
  //     assert.ok(rev_output.match("commit " + c2));
  //     finished();
  //   })
  // },
  // 
  // "Should correctly honor max count":function(assert, finished) {
  //   var git = new Git("./test/dot_git");
  //   git.rev_list({max_count:10}, 'master', function(err, rev_output) {
  //     assert.equal(10, rev_output.split(/\n/).length);
  //     finished();
  //   })    
  // },
  // 
  // "Should correctly retrieve the diff between two commits":function(assert, finished) {
  //   var commit1 = '2d3acf90f35989df8f262dc50beadc4ee3ae1560';
  //   var commit2 = '420eac97a826bfac8724b6b0eef35c20922124b7';
  // 
  //   var git = new Git("./test/dot_git");
  //   git.diff(commit1, commit2, function(err, out) {
  //     sys.puts(out);
  //     finished();
  //   });
  // }
  // 
  // 
  // 
  // // __bake__
  // "Test commit bake":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.rev_list = function(a, b, callback) {
  //         callback(null, fixture('rev_list_single'));
  //       }
  //       
  //     var commit = new Commit(repo, '4c8124ffcf4039d292442eeccabdeca5af5c5017')
  //     assert.equal("Tom Preston-Werner", commit.author.name);
  //     assert.equal("tom@mojombo.com", commit.author.email);        
  //     finished();
  //   });    
  // },
  // 
  // // short_name
  // "Test abbreviation of id":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.commit('80f136f500dfdb8c3e8abf4ae716f875f0a1b57f', function(err, commit) {
  //       commit.id_abbrev(function(err, id_abbrev) {
  //         assert.equal("80f136f", id_abbrev);
  //         finished();        
  //       })
  //     });
  //   });        
  // },
  // 
  // // count
  // "Test commit count":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     Commit.count(repo, 'master', function(err, count) {
  //       assert.equal(107, count);
  //       finished();
  //     })
  //   });    
  // },
  // 
  // // diff
  // "Test correct execution of diff":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.diff = function(a, b, callback) {
  //         assert.equal(true, a['full_index']);
  //         assert.equal('master', b);        
  //         callback(null, fixture('diff_p'));
  //       }
  //       
  //     // Fetch the diff
  //     Commit.diff(repo, 'master', function(err, diffs) {
  //       assert.equal('.gitignore', diffs[0].a_path);
  //       assert.equal('.gitignore', diffs[0].b_path);
  //       assert.equal('4ebc8aea50e0a67e000ba29a30809d0a7b9b2666', diffs[0].a_blob.id);
  //       assert.equal('2dd02534615434d88c51307beb0f0092f21fd103', diffs[0].b_blob.id);
  //       assert.equal('100644', diffs[0].b_mode);
  //       assert.equal(false, diffs[0].new_file);
  //       assert.equal(false, diffs[0].deleted_file);
  //       assert.equal("--- a/.gitignore\n+++ b/.gitignore\n@@ -1 +1,2 @@\n coverage\n+pkg", diffs[0].diff);
  //       
  //       assert.equal('lib/grit/actor.rb', diffs[5].a_path);
  //       assert.equal(null, diffs[5].a_blob);
  //       assert.equal('f733bce6b57c0e5e353206e692b0e3105c2527f4', diffs[5].b_blob.id);
  //       assert.equal(true, diffs[5].new_file);
  //       finished();
  //     });
  //   });        
  // },
  // 
  // "Test diff with two commits":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.diff = function(a, b, c, callback) {
  //         assert.equal(true, a['full_index']);
  //         assert.equal('59ddc32', b);        
  //         assert.equal('13d27d5', c);        
  //         callback(null, fixture('diff_2'));
  //       }
  //       
  //     // Fetch the diff
  //     Commit.diff(repo, '59ddc32', '13d27d5', function(err, diffs) {
  //       assert.equal(3, diffs.length);
  //       assert.deepEqual(["lib/grit/commit.rb", "test/fixtures/show_empty_commit", "test/test_commit.rb"], diffs.map(function(diff) { return diff.a_path; }));
  //       finished();
  //     });
  //   });    
  // },
  // 
  // "Test diff with files":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.diff = function(a, b, c, d, callback) {
  //         assert.equal(true, a['full_index']);
  //         assert.equal('59ddc32', b);        
  //         assert.equal('--', c);        
  //         assert.equal('lib', d);
  //         callback(null, fixture('diff_f'));
  //       }
  //       
  //     // Fetch the diff
  //     Commit.diff(repo, '59ddc32', ["lib"], function(err, diffs) {
  //       assert.equal(1, diffs.length);
  //       assert.deepEqual('lib/grit/diff.rb', diffs[0].a_path);
  //       finished();
  //     });
  //   });        
  // },
  // 
  // "Test diff with two commits and files":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.diff = function(a, b, c, d, e, callback) {
  //         assert.equal(true, a['full_index']);
  //         assert.equal('59ddc32', b);
  //         assert.equal('13d27d5', c);
  //         assert.equal('--', d);
  //         assert.equal('lib', e);
  //         callback(null, fixture('diff_2f'));
  //       }
  //       
  //     // Fetch the diff
  //     Commit.diff(repo, '59ddc32', '13d27d5', ["lib"], function(err, diffs) {
  //       assert.equal(1, diffs.length);
  //       assert.deepEqual('lib/grit/commit.rb', diffs[0].a_path);
  //       finished();
  //     });
  //   });    
  // },
  // 
  // // diffs
  // "Test diffs":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.diff = function() {
  //         var args = Array.prototype.slice.call(arguments, 0);
  //         // Pop the callback
  //         var callback = args.pop();
  //         callback(null, fixture('diff_p'));
  //       }
  //       
  //     // Fetch the diff
  //     var commit = new Commit(repo, '91169e1f5fa4de2eaea3f176461f5dc784796769');
  //     commit.diffs(function(err, diffs) {
  //       assert.equal(15, diffs.length);
  //       
  //       assert.equal('.gitignore', diffs[0].a_path);
  //       assert.equal('.gitignore', diffs[0].b_path);
  //       assert.equal('4ebc8aea50e0a67e000ba29a30809d0a7b9b2666', diffs[0].a_blob.id);
  //       assert.equal('2dd02534615434d88c51307beb0f0092f21fd103', diffs[0].b_blob.id);
  //       assert.equal('100644', diffs[0].b_mode);
  //       assert.equal(false, diffs[0].new_file);
  //       assert.equal(false, diffs[0].deleted_file);
  //       assert.equal("--- a/.gitignore\n+++ b/.gitignore\n@@ -1 +1,2 @@\n coverage\n+pkg", diffs[0].diff);
  //       
  //       assert.equal('lib/grit/actor.rb', diffs[5].a_path);
  //       assert.equal(null, diffs[5].a_blob);
  //       assert.equal('f733bce6b57c0e5e353206e692b0e3105c2527f4', diffs[5].b_blob.id);
  //       assert.equal(true, diffs[5].new_file);
  //       
  //       finished();
  //     });
  //   });        
  // }, 
  // 
  // "Test diffs on initial import":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.show = function(options, sha, callback) {
  //         assert.deepEqual({full_index:true, pretty:'raw'}, options);
  //         assert.equal('634396b2f541a9f2d58b00be1a07f0c358b999b3', sha);          
  //         callback(null, fixture('diff_i', true));
  //       }
  //       
  //     // Fetch the diff
  //     var commit = new Commit(repo, '634396b2f541a9f2d58b00be1a07f0c358b999b3');
  //     commit.diffs(function(err, diffs) {
  //       assert.equal(10, diffs.length);
  //       
  //       assert.equal('History.txt', diffs[0].a_path);
  //       assert.equal('History.txt', diffs[0].b_path);
  //       assert.equal(null, diffs[0].a_blob);
  //       assert.equal(null, diffs[0].b_mode);
  //       assert.equal('81d2c27608b352814cbe979a6acd678d30219678', diffs[0].b_blob.id);
  //       assert.equal(true, diffs[0].new_file);
  //       assert.equal(false, diffs[0].deleted_file);
  //       assert.equal("--- /dev/null\n+++ b/History.txt\n@@ -0,0 +1,5 @@\n+== 1.0.0 / 2007-10-09\n+\n+* 1 major enhancement\n+  * Birthday!\n+", diffs[0].diff);
  //       
  //       assert.equal('lib/grit.rb', diffs[5].a_path);
  //       assert.equal(null, diffs[5].a_blob);
  //       assert.equal('32cec87d1e78946a827ddf6a8776be4d81dcf1d1', diffs[5].b_blob.id);
  //       assert.equal(true, diffs[5].new_file);        
  //       finished();
  //     });
  //   });            
  // },
  // 
  // "Test diffs on initial import with empty commit":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.show = function(options, sha, callback) {
  //         assert.deepEqual({full_index:true, pretty:'raw'}, options);
  //         assert.equal('634396b2f541a9f2d58b00be1a07f0c358b999b3', sha);          
  //         callback(null, fixture('show_empty_commit', true));
  //       }
  //       
  //     // Fetch the diff
  //     var commit = new Commit(repo, '634396b2f541a9f2d58b00be1a07f0c358b999b3');      
  //     commit.diffs(function(err, diffs) {
  //       assert.deepEqual([], diffs);
  //       finished();
  //     });
  //   });                
  // },
  // 
  // "Test diffs with mode only change":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     repo.git.diff = function(options, sha, callback) {
  //         var args = Array.prototype.slice.call(arguments, 0);
  //         callback = args.pop();
  //         callback(null, fixture('diff_mode_only', true));
  //       }
  //       
  //     // Fetch the diff
  //     var commit = new Commit(repo, '91169e1f5fa4de2eaea3f176461f5dc784796769');      
  //     commit.diffs(function(err, diffs) {
  //       assert.equal(23, diffs.length);
  //       assert.equal('100644', diffs[0].a_mode);
  //       assert.equal('100755', diffs[0].b_mode);
  //       finished();
  //     });
  //   });    
  // },
  // 
  // // to String
  // "Test toString() override for the commit":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     // Fetch the diff
  //     var commit = new Commit(repo, 'abc');
  //     assert.equal("abc", commit.toString());
  //     finished();
  //   });
  // },
  // 
  // // to patch
  // "Test create patch from commit":function(assert, finished) {
  //   new Repo("./test/dot_git", {is_bare:true}, function(err, repo) {
  //     // Fetch the diff
  //     var commit = new Commit(repo, '80f136f500dfdb8c3e8abf4ae716f875f0a1b57f');
  //     commit.toPatch(function(err, patch) {
  //       // sys.puts(patch)
  //       assert.ok(patch.indexOf('From 80f136f500dfdb8c3e8abf4ae716f875f0a1b57f Mon Sep 17 00:00:00 2001') != -1);
  //       assert.ok(patch.indexOf('From: tom <tom@taco.(none)>') != -1);
  //       assert.ok(patch.indexOf('Date: Tue, 20 Nov 2007 17:27:42 -0800') != -1);
  //       assert.ok(patch.indexOf('Subject: [PATCH] fix tests on other machines') != -1);
  //       assert.ok(patch.indexOf('test/test_reality.rb |   30 +++++++++++++++---------------') != -1);
  //       assert.ok(patch.indexOf('@@ -1,17 +1,17 @@') != -1);
  //       assert.ok(patch.indexOf('+#     recurse(t)') != -1);
  //       assert.ok(patch.indexOf('1.6.') != -1);
  //       finished();
  //     });
  //   });    
  // },
});

















