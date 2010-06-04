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
  #include "deps/libgit2/src/git/odb.h"
  #include "deps/libgit2/src/git/commit.h"
}

#include <iostream>
#include <stdio.h>

using namespace v8;

Handle<Value> hello(const Arguments& args) {
  HandleScope scope;
  
  struct stat stFileInfo;
  String::Utf8Value path(args[0]->ToString());
  char* cpath=*path;
  int intStat = stat(cpath,&stFileInfo); 

  // Let's open the git repository
  git_odb *db;
  int ret;
  
  if(git_odb_open(&db, cpath)) {
    return String::New("true");    
  } else {
    return String::New("false");          
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
}

extern "C" void init (Handle<Object> target) {
  HandleScope scope;
  target->Set(String::New("hello"), FunctionTemplate::New(hello)->GetFunction());
}
