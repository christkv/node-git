/**
 * FAST nodejs(http://github.com/ry/node/) library for making hashes
 *
 * @package hashlib
 * @link http://github.com/brainfucker/hashlib
 * @autor Oleg Illarionov <oleg@emby.ru>
 * @version 1.0
 */
 
#include <v8.h>
#include <ev.h>
#include <eio.h>
#include <fcntl.h>


extern "C" {
  // Git inclue files
  #include "deps/libgit2/src/common.h"
  #include "deps/libgit2/src/commit.h"
  #include "deps/libgit2/src/git/odb.h"
  #include "deps/libgit2/src/git/commit.h"
  #include "deps/libgit2/src/git/revwalk.h"
}

#include <iostream>
#include <stdio.h>

using namespace v8;

static const int commit_sorting_topo[] = {0, 1, 2, 3, 5, 4};
static const int commit_sorting_time[] = {0, 3, 1, 2, 5, 4};
static const int commit_sorting_topo_reverse[] = {4, 5, 3, 2, 1, 0};
static const int commit_sorting_time_reverse[] = {4, 5, 2, 1, 3, 0};
static const int commit_sorting_topo_time[] = {0};

Handle<Value> hello(const Arguments& args) {
  HandleScope scope;
  
  String::Utf8Value path(args[0]->ToString());
  char* cpath=*path;

  // Let's open the git repository
  git_odb *db;
  git_revpool *pool;
  
  if(git_odb_open(&db, cpath)) {
    return String::New("failed to open");          
  }
  
  pool = gitrp_alloc(db);

  if(pool == NULL) {
    return String::New("failed to allocate pool");
  }

  printf("================ pool allocated\n");
  
  #define TEST_WALK(sort_flags, result_array) {\
    printf("=============================== executing TEST_WALK\n");\
    char oid[40]; int i = 0;\
    git_commit *commit = NULL;\
    gitrp_sorting(pool, sort_flags);\
    while ((commit = gitrp_next(pool)) != NULL) {\
      printf("------------- hello\n");\
      git_oid_fmt(oid, &commit->object.id);\
    }\
    gitrp_reset(pool);\
  }  
  
  TEST_WALK(GIT_RPSORT_TIME, commit_sorting_time);
  TEST_WALK(GIT_RPSORT_TOPOLOGICAL, commit_sorting_topo);
  TEST_WALK(GIT_RPSORT_TIME | GIT_RPSORT_REVERSE, commit_sorting_time_reverse);
  TEST_WALK(GIT_RPSORT_TOPOLOGICAL | GIT_RPSORT_REVERSE, commit_sorting_topo_reverse);  
    
  return String::New(cpath);    
  }
  
  // 
  // if((gitfo_open(cpath, O_RDONLY)) < 0) {
  // } else {
  //   return String::New("false");      
  // }
  // 
  // 
  // String::Utf8Value path(args[0]->ToString());
  //   int gitfo_open(const char *path, int flags)
  //   {
  //    int fd = open(path, flags | O_BINARY);
  //    return fd >= 0 ? fd : git_os_error();
  //   }
  // 
  //   
  // git_file fd;
  // int ret;
  // 
  // if ((fd = gitfo_creat(file, S_IREAD | S_IWRITE)) < 0)
  //  return -1;
  // ret = gitfo_write(fd, data, len);
  // gitfo_close(fd);
  // 
  // return ret;
  
  // struct stat stFileInfo;
  // String::Utf8Value path(args[0]->ToString());
  // char* cpath=*path;
  // int intStat = stat(cpath,&stFileInfo); 
  // if (intStat == 0) {
  //   if (args[1]->IsFunction()) {
  //    v8::Local<v8::Object> arguments = v8::Object::New();
  //    arguments->Set(String::New("path"),args[0]->ToString());
  //    arguments->Set(String::New("callback"),args[1]);
  //    arguments->Set(String::New("recv"),args.This());
  //    Persistent<Object> *data = new Persistent<Object>();
  //    *data = Persistent<Object>::New(arguments);
  // 
  //   file_data *fd=new file_data;
  //    fd->byte = 0;
  //    fd->environment = data;
  //  
  //    MD5Init(&fd->mdContext);
  //    ev_ref(EV_DEFAULT_UC);
  //    return get_md5_file_async(cpath,static_cast<void*>(fd));
  //   } else {
  //    return get_md5_file(cpath);
  //   }
  // } else {
  //   std::string s="Cannot read ";
  //   s+=cpath;
  //   return ThrowException(Exception::Error(String::New(s.c_str())));
  // }  
  // return new v8::String::New("hello world");  
  // return String::New("hello world");  
// }

extern "C" void init (Handle<Object> target) {
  HandleScope scope;
  target->Set(String::New("hello"), FunctionTemplate::New(hello)->GetFunction());
}
