var sys = require('sys'),
    fs = require('fs'),
    GitFileOperations = require('git/git_file_operations').GitFileOperations;

var Git = exports.Git = function(git_directory) {
  var _git_diretory = git_directory;
  // Control access to internal variables
  Object.defineProperty(this, "git_directory", { get: function() { return _git_diretory; }, set: function(value) { _git_diretory = value; }, enumerable: true});    
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

var call_git = function(command, options, string) {
  
}

// Retrieve references
Git.prototype.refs = function(options, prefix, callback) {
  // Locate all files in underlying directories
  GitFileOperations.glob(this.git_directory, function(err, files) {
    // sys.puts("=================================================================================");
    // sys.puts(sys.inspect(files))
  });
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
         sys.puts(data)
         // Split the data on new line
         // var refs = data.split(/\n/);
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
         call_git('rev-parse', options, string, function(err, result) {
           result = result ? chomp(result) : result;
           callback(err, result);
         })
       });
       
     });
   });
 });
 
 
 
}





















