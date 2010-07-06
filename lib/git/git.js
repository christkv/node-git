var sys = require('sys'),
    fs = require('fs'),
    GitFileOperations = require('git/git_file_operations').GitFileOperations,
    exec = require('child_process').exec,
    FileIndex = require('git/file_index').FileIndex,
    Repository = require('git/repository').Repository;

var Git = exports.Git = function(git_directory) {
  var _git_diretory = git_directory, _git_file_index;
  var _repository = new Repository(_git_diretory, {});
  // Control access to internal variables
  Object.defineProperty(this, "git_directory", { get: function() { return _git_diretory; }, set: function(value) { _git_diretory = value; }, enumerable: true});    
  Object.defineProperty(this, "git_file_index", { get: function() { return _git_file_index; }, set: function(value) { _git_file_index = value; }, enumerable: true});    
  Object.defineProperty(this, "repository", { get: function() { return _repository; }, set: function(value) { _repository = value; }, enumerable: true});    
}

// Set up the gitbinary
if(process.platform.toLowerCase().match(/mswin(?!ce)|mingw|bccwin/)) {
  Git.git_binary = "git";
} else {
  Git.git_binary = "/usr/bin/env git";
}

// Chomp text removing end carriage returns
var chomp = function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}

var read_file = function(path, callback) {
  fs.stat(path, function(err, stat) {
    if(err) return callback(err, null);  
    fs.readFile(path, 'ascii', callback);      
  })
}

// Retrieve references
Git.prototype.refs = function(options, prefix, callback) {
  var refs = [];
  var already = {};
  var self = this;

  // Locate all files in underlying directories
  var stream = GitFileOperations.glob_streaming(this.git_directory + "/" + prefix);  
  // Triggers on each entry in the directory
  stream.addListener("data", function(result) {
    // If we have a directory check if we have a reference file
    if(result.stat.isFile()) {
      // Read the file content
      try {
        var id = chomp(fs.readFileSync(result.path, 'ascii'));
        var name = result.path.replace(self.git_directory + "/" + prefix + "/", '');

        if(!already[name]) {
          refs.push(name + " " + id);
          already[name] = true;
        }        
      } catch(err) {
        // Seems to be some instances where it's not able to tell that a directory is not a file ?
      }
    }
  });
  
  // Triggers at the end of the call
  stream.addListener("end", function(err, result) {
    fs.stat(self.git_directory + "/packed-refs", function(err, stat) {
      if(err || !stat.isFile()) return callback(null, refs.join("\n"));
      
      read_file(self.git_directory + "/packed-refs", function(err, data) {
        var parts = data.split(/\n/);
        // Scan all lines
        for(var i = 0; i < parts.length; i++) {
          var match = parts[i].match(/^(\w{40}) (.*?)$/)
          if(match) {
            var id = chomp(match[1]);
            var name = match[2].replace(prefix + "/", '');
            
            if(!already[name]) {
              refs.push(name + " " + id);
              already[name] = true;
            }
          }          
        }
        // Return all the references
        callback(null, refs.join("\n"));
      });      
    })
  })
}

// Read a specific file
Git.prototype.fs_read = function(file, callback) {
  GitFileOperations.fs_read(this.git_directory, file, callback);
}

// Parse revisions
Git.prototype.rev_parse = function(options, string, callback) {
 if(string == null || string.constructor != String) return callback("invalid string: " + string);
 var self = this;
 
 // Make sure we don't have a directory up ..
 if(string.match(/\.\./)) {
   var shas = string.split(/\.\./);
   var sha1 = shas[0], sha2 = shas[1];   
   // Need to rev_parse the two keys and return the data
   new Simplifier().execute(new ParallelFlow(
      function(callback) { self.rev_parse({}, sha1, callback); },
      function(callback) { self.rev_parse({}, sha2, callback); }
     ), function(sha1_results, sha2_results) {
     // Return the collected files
     return callback(null, [sha1_results[1], sha2_results[1]]);
   });
 }
 
 // If we have a sha being returned nop it
 if(string.match(/^[0-9a-f]{40}$/)) {
   return callback(null, chomp(string));
 }
 
 // Check in heads directory
 read_file(self.git_directory + "/refs/heads/" + string, function(err, data) {
   if(!err) return fs.readFile(self.git_directory + "/refs/heads/" + string, function(err, data) { callback(err, chomp(data)); });
   // If not in heads then check in remotes
   read_file(self.git_directory + "/refs/remotes/" + string, function(err, data) {
     if(!err) return fs.readFile(self.git_directory + "/refs/remotes/" + string, function(err, data) { callback(err, chomp(data)); });
     // If not in remotes check in tags
     read_file(self.git_directory + "/refs/tags/" + string, function(err, data) {
       if(!err) return fs.readFile(self.git_directory + "/refs/tags/" + string, function(err, data) { callback(err, chomp(data)); });

       // Not pin any of the main refs, look in packed packed-refs
       read_file(self.git_directory + "/packed-refs", function(err, data) {
         if(err) return callback(err, data);
         // Split the data on new line
         var ref = null;
         var parts = data.split(/\n/);
         // Locate head
         for(var i = 0; i < parts.length; i++) {
           var match_parts = parts[i].match(/^(\w{40}) refs\/.+?\/(.*?)$/);
           if(match_parts) {             
             ref = match_parts[1];
             // If we have a match fetch reference and return
             if(new RegExp(string + '$').test(match_parts[3])) {
               break;
             }
           }           
         }
         // If we have a reference lets terminate
         if(ref) return callback(null, ref);         

         // !! more partials and such !!
         
         // revert to calling git 
         self.call_git('', 'rev-parse', '', options, string, function(err, result) {
           result = result ? chomp(result) : result;
           callback(err, result);
         })
       });       
     });
   });
 });
}

var transform_options = function(options) {
  var args = [];
  var keys = Object.keys(options);
  
  // Process all entries
  Object.keys(options).forEach(function(key) {
    if(key.length == 1) {
      if(options[key] == true && options[key].constructor == Boolean) { args.push("-" + key);        
      } else if(options[key] == false && options[key].constructor == Boolean) {
      } else { args.push("-" + key + " '" + options[key].toString() + "'"); }
    } else {
      if(options[key] == true && options[key].constructor == Boolean) { args.push("--" + key.toString().replace(/_/, '-'));
      } else if(options[key] == false && options[key].constructor == Boolean) {        
      } else { args.push("--" + key.toString().replace(/_/, '-') + "='" + options[key] + "'"); }
    }
  });    
  // Return formated parametes
  return args;
}

// Call the native git binary
Git.prototype.call_git = function(prefix, command, postfix, options, args, callback) {
  // Do we have a timeout 
  var timeout = options['timeout'] ? timeout : 1000 * 60;
  // Remove the timeout property if we have one
  if(options['timeout']) delete options['timeout'];
  var option_arguments = transform_options(options);
  
  if(process.platform.toLowerCase().match(/mswin(?!ce)|mingw|bccwin/)) {    
  } else {
    // Map the extra parameters
    var ext_args = args.map(function(arg) { return (arg == '--' || arg.substr(0, 1) == '|' ? arg : ("\"" + arg + "\""))})
                    .filter(function(arg) { return arg == null || arg == '' ? false : true});
    // Join the arguments
    var final_arguments = option_arguments.concat(ext_args);
    // Build a call
    var call = prefix + Git.git_binary + " --git-dir='" + this.git_directory + "' " + command.toString().replace(/_/, '-') + " " + final_arguments.join(' ') + postfix;
  }  

  // Execute the git command
  exec(call, { encoding: 'utf8', timeout: timeout, killSignal: 'SIGKILL'},          
    function (error, stdout, stderr) {
      if (error !== null) { 
        callback(error, null);
      } else {
        callback(null, stdout)
      }
  });        
}

var file_index = function(git, callback) {
  // If we have a file index object return it otherwise create a new one
  if(!git.git_file_index) {
    new FileIndex(git.git_directory, function(err, _file_index) {
      git.git_file_index = _file_index;
      callback(null, _file_index);
    });
  } else {
    callback(null, git.git_file_index);
  }
}

var rev_parse = function(options, string, callback) {
  
}

// Fetch a revision list
Git.prototype.rev_list = function(options, reference, callback) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 0);
  callback = args.pop();
  options = args.length ? args.shift() : {};    
  reference = args.length ? args.shift() : 'master';    

  // Remove skip option if it's set to 0
  if(options['skip'] && parseInt(options['skip']) == 0) delete options.skip;
  var allowed_options = {"max_count":1, "since":1, "until":1, "pretty":1};
  var establish_keys = Object.keys(options).filter(function(key) {
      return allowed_options[key] ? false : true;
    });
    
  // If we have commands we don't support call through to native git
  if(establish_keys.length > 0) {    
    this.call_git('', 'rev_list', '', options, [reference], function(err, result) {
      callback(err, result);
    })
  } else if(Object.keys(options).length == 0){
    // Fetch the file index (will create a file index on the first call)
    file_index(this, function(err, _file_index) {
      if(err) return callback(err, _file_index);
      // Parse the revision
      self.rev_parse({}, reference, function(err, ref) {
        if(err) return callback(err, ref);        
        // Fetch the commits from the revision passed in
        _file_index.commits_from(ref, function(err, commits) {    
          if(err) {
            this.call_git('', 'rev_list', '', options, [reference], function(err, result) {
              callback(err, result);
            })                    
          } else {
            callback(null, commits.join("\n") + "\n");            
          }
        })
      });
    })    
  } else {
    self.rev_parse({}, reference, function(err, ref) {
      if(err) return callback(err, ref);        
      
      if(Array.isArray(ref)) {
        this.call_git('', 'rev_list', '', options, [reference], function(err, result) {
          callback(err, result);
        })        
      } else {        
        try {
          // Try to execute revision fetch
          self.repository.rev_list(ref, options, function(err, result) {
            callback(err, result);
          })          
        } catch(err) {
          callback(err, null);
        }
      }
    });
  }
}

// List tree content
Git.prototype.ls_tree = function(options, treeish, paths, callback) {
  sys.puts("=== Git.prototype.ls_tree = function(options, treeish, paths, callback)")
}

// Cat a file
Git.prototype.cat_file = function(type, ref, callback) {
  if(type == "t") {
    // file_type(ref)
  } else if(type == "s") {
    // file_size(ref)
  } else if(type == "p") {
    // ruby_git.cat_file(ref)
  }
}

// Make a directory
//  dir: is the relative path to the directory to create
//
// Return nothing
Git.prototype.fs_mkdir = function(dir, callback) {
  var path = this.git_directory + "/" + dir;
  GitFileOperations.fs_mkdir(path, callback);
}

// Initialize a new git repository (create physical setup)
Git.prototype.init = function(options, callback) {
  
}

// Clone a directory
Git.prototype.clone = function(options, original_path, target_path, callback) {  
}

// Generate diff from the changes between two shas
// Git.prototype.diff = function(options, sha1, sha2, callback) {  
// }

var simple_diff = function(repo, options, sha1, sha2, callback) {
  
}

var native_diff = function(repo, options, sha1, sha2, base, paths, callback) {
  
}

Git.prototype.diff = function() {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 0);
  // Pop the callback
  var callback = args.pop();
  
  if(args.length <= 3) {
    // we have the call form function(options, sha1, sha2, callback)
    var options = args.length ? args.shift() : {};
    var sha1 = args.length ? args.shift() : null;
    var sha2 = args.length ? args.shift() : null;
    // Call the simple diff
    simple_diff(self.repo, options, sha1, sha2, callback);
  } else {
    // call the native diff with the options
    args.push(callback);
    args.unshift(self.repo);
    native_diff.call(this, args);
  }
}

// Check if a file exists
Git.prototype.fs_exist = function(path, callback) {
  GitFileOperations.fs_exist(this.git_directory, path, callback);
}

// Write a normal file to the filesystem
//  file: relative path from the Git dir
//  contents: String content to be written
//
// Return nothing
Git.prototype.fs_write = function(file, content, callback) {
  GitFileOperations.fs_write(this.git_directory, file, content, callback);
}

// Log function, returns the number of logs
Git.prototype.log = function(commit, path, options, callback) {
  
}

// Select the objects that exists
//  object_ids: array of object sha's
//
// Returns array of ids's that exist
Git.prototype.select_existing_objects = function(object_ids, callback) {
  var existing_object_ids = [];
  // Process all the object ids
  for(var i = 0; i < object_ids.length; i++) {
    // Check if the object_id exists in the db
    this.repository.object_exists(object_ids[i], function(err, result)  {
      if(err) return callback(err, result);
      if(result) existing_object_ids.push(object_ids[i]);
    });
  }
  // Return all the existing objects
  callback(null, existing_object_ids);
}

// Format the patch
Git.prototype.format_patch = function(options, reference, callback) {
  this.call_git('', 'format_patch', '', options, [reference], function(err, result) {
    callback(err, result);
  })  
}

// repo.git.blame({p:true}, commit, '--', file, function(err, blame_output) {
//   process_raw_blame(blame, blame_output, repo, callback)
// });


// Fetch the blame
Git.prototype.blame = function() {
  // Unpack parameters as commit might be null
  var args = Array.prototype.slice.call(arguments, 0);
  callback = args.pop();
  var options = args.length ? args.shift() : {};
  var arguments = args;

  // Execute blame command
  this.call_git('', 'blame', '', options, arguments, function(err, result) {
    callback(err, result);
  });  
}





















