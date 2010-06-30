var sys = require('sys'),
  GitObject = require('git/git_object').GitObject,
  fs = require('fs'),
  LooseStorage = require('git/loose_storage').LooseStorage,
  PackStorage = require('git/pack_storage').PackStorage;

Repository = exports.Repository = function(git_directory, options) {  
  var _git_directory = git_directory;
  var _options = options ? options : {};
  var _packs = [];
  var _loose = null;
  var _already_searched = {};
  var self = this;
  
  Object.defineProperty(this, "git_directory", { get: function() { return _git_directory; }, set: function(value) { _git_directory = value; }, enumerable: true});    
  Object.defineProperty(this, "options", { get: function() { return _options; }, set: function(value) { _options = value; }, enumerable: true});    
  Object.defineProperty(this, "already_searched", { get: function() { return _already_searched; }, set: function(value) { _already_searched = value; }, enumerable: true});      
  Object.defineProperty(this, "packs", { get: function() { return _packs; }, set: function(value) { _packs = value; }, enumerable: true});      
  Object.defineProperty(this, "loose", { get: function() { return _loose; }, set: function(value) { _loose = value; }, enumerable: true});      
}

// Chomp text removing end carriage returns
var chomp = function chomp(raw_text) {
  return raw_text.replace(/(\n|\r)+$/, '');
}

var truncate_array = function(array, sha) {
  
}

// takes the following options:
//  :since - Time object specifying that you don't want commits BEFORE this
//  :until - Time object specifying that you don't want commit AFTER this
//  :first_parent - tells log to only walk first parent
//  :path_limiter - string or array of strings to limit path
//  :max_count - number to limit the output
Repository.prototype.log = function(sha, options, callback) {
  this.already_searched = {}
  return walk_log(this, sha, options);
}

var close = function(repo) {
  if(repo.packs) {
    repo.packs.forEach(function(pack) { pack.close(); });
  }
}

var git_path = function(repo, path) { return repo.git_directory + "/" + path; }

var load_loose = function(repo, path) {
  repo.loaded.push(path);
  try {
    fs.statSync(path);
    repo.loose.push(new LooseStorage(path));
  } catch (err) {
    return;    
  }
}

var load_alternate_loose = function(repo, path) {
  
}

var initloose = function(repo) {
  repo.loaded = [];
  repo.loose = [];
  load_loose(repo, git_path(repo, 'objects'));
  load_alternate_loose(repo, git_path(repo, 'objects'));
  return repo.loose;
}

var load_packs = function(repo, path) {
  repo.loaded_packs.push(path);
  // try {
    fs.statSync(path);
    // Read and process all entries in the directory
    fs.readdirSync(path).forEach(function(entry) {
      // If we have a pack file create a new storage object
      if(entry.match(/\.pack$/i)) {
        var pack = new PackStorage(path + "/" + entry);
        // If we have specified the map for the pack then load the entire object map
        if(repo.options["map_packfile"]) {
          pack.cache_objects();
        }
        // Add pack to list of packs in the repo
        repo.packs.push(pack)
      }
    });
  // } catch (err) {    
  // }
}

var load_alternate_packs = function(repo, path) {
  var alt = path + "/info/alternates";
  try {
    fs.readSync(alt);
    // Read in the file and parse each line
    var data = fs.readFileSync(alt, 'ascii');
    data.split("\n").forEach(function(line) {
      if(line.substr(0, 2) == "..") {
        line = fs.realpathSync(repo.git_directory + "/" + line);
      }
      // Get pack file name
      var full_pack = chomp(line) + "/pack";
      if(repo.loaded_packs(full_pack) == -1) {
        load_packs(full_pack);
        load_alternate_packs(chomp(line));
      }
    })
  } catch(err) {    
  }
}

var initpacks = function(repo) {
  close(repo);
  repo.loaded_packs = [];
  repo.packs = [];
  load_packs(repo, git_path(repo, "objects/pack"));
  load_alternate_packs(repo, git_path(repo, "objects"));
  return repo.packs;
}

var get_raw_object_by_sha = function(repo, sha1o) {
  if(!sha1o || sha1o == "" || sha1o.constructor != String) throw "no such sha found";
  
  var sha1 = '';
  for(var i = 0; i < sha1o.length; i = i + 2) {
    sha1 = sha1 + String.fromCharCode(parseInt(sha1o.substr(i, 2), 16));
  }
  // Init packs if we have none set yet
  if(!repo.packs) initpacks(repo);

  // Try packs
  var packs = repo.packs;
  for(var i = 0; i < packs.length; i++) {
    var o = packs[i].find(sha1);    
    if(o != null) return o;
  }

  if(!repo.loose) initloose(repo);
  // Try loose storage
  var looses = repo.loose;
  for(var i = 0; i < looses.length; i++) {
    var o  = looses[i].find(sha1);
    if(o) return o;
  }
  
  // try packs again maybe the object got packed in the meantime
  initpacks(repo);
  
  // Try packs
  var packs = repo.packs;
  for(var i = 0; i < packs.length; i++) {
    var o = packs[i].find(sha1);    
    if(o) return o;
  }
  
  // No results throw an error that no sha pack object was found
  throw "no such sha found";
}

var get_object_by_sha1 = function(sha) {
  
}

var files_changed = function(tree, object, limit) {
  
}

var walk_log = function(repo, sha, options, total_size) {
  if(!total_size) total_size = 0;
  if(repo.already_searched[sha]) return [];
  // Empty array
  var array = [];
  var o = null, commit_sha = null, c = null, output = null;

  if(sha) {
    // Get the raw object
    o = get_raw_object_by_sha(repo, sha);
    // Create a git object from the raw object
    if(o.type == "tag") {
      commit_sha = get_object_by_sha1(repo, sha).object;
      c = get_object_by_sha1(repo, commit_sha);
    } else {
      c = GitObject.from_raw(o, repo);
    }

    // If it is not a commit
    if(c.type != "commit") return [];  
    // Add sha
    var add_sha = true;
    
    // Check if the commit should be in the results
    if(options["size"] && (options["since"] && options["since"].constructor == Date) && (options["since"] > c.committer.date)) {
      add_sha = false;
    }    
    if(options["until"] && (options["until"] && options["until"].constructor == Date) && (options["until"] < c.committer.date)) {
      add_sha = false;
    }
    
    // Follow all parents unless --first-parent is specified
    var subarray = [];
    
    if(c.parent.length == 0 && options["path_limiter"]) {
      add_sha = false;
    }
    
    if(!options["max_count"] || ((array.length + total_size) < options["max_count"])) {
      
      if(!options["path_limiter"]) {
        output = c.raw_log(sha);
        array.push([sha, output, c.committer.date]);
      }

      if(options["max_count"] && (array.length + total_size) >= options["max_count"]) {
        return array;
      }
      
      for(var i = 0; i < c.parent.length; i++) {
        var psha = c.parent[i];
        
        if(psha && !files_changed(c.tree, get_object_by_sha1(repo, psha).tree, options["path_limiter"])) {
          add_sha = false;
        }        
        
        // Walk the next level of the tree
        subarray.concat(walk_log(repo, psha, options, (array.length + total_size)));
        if(options["first_parent"]) break;
      }
      
      if(options["path_limiter"] && add_sha) {
        output = c.raw_log(sha);
        array.push([sha, output, c.comitter.date]);        
      }
      
      if(add_sha) {
        array.concat(subarray);
      }
    }
  }
  // Return all the commits
  return array;
}

Repository.prototype.rev_list = function(sha, options, callback) {
  try {
    var end_sha = null;

    if(Array.isArray(sha)) {
      end_sha = sha[0], sha = sha[1];
    }

    // Walk the log
    var log = this.log(sha, options);
    // Sort the log
    log.sort(function(a, b) {
      return a[2].localeCompare(b[2])
    }).reverse();

    // Shorten the list if it's longer than max_count
    if(options['max_count']) {
      var opt_len = parseInt(options['max_count']);
      // If the length is less than the total log
      if(opt_len < log.length) {
        log = log.slice(0, opt_len);
      }
    }

    // Pretty print the result if option is specified
    if(options['pretty'] == 'raw') {
      log = log.map(function(log) { return log[1]; }).join("");
    } else {
      log = log.map(function(log) { return log[0]; }).join("\n");
    }

    // Return the log
    callback(null, log);    
  } catch (err) {
    callback(err, null);
  }
}

// Returns true/false if that sha exists in the db
Repository.prototype.object_exists = function(sha1, callback) {
  // TODO TODO TODO
  throw "Repository.prototype.object_exists NOT IMPLEMENTED"
}