#include <node.h>
#include <node_events.h>
#include <assert.h>
#include <string.h>
#include <stdlib.h>
#include <zlib.h>

#define CHUNK 16384

using namespace v8;
using namespace node;

class Gzip : public EventEmitter {
 public:
   
  static void Initialize (v8::Handle<v8::Object> target){
    HandleScope scope;
    Local<FunctionTemplate> t = FunctionTemplate::New(New);

    t->Inherit(EventEmitter::constructor_template);
    t->InstanceTemplate()->SetInternalFieldCount(1);

    NODE_SET_PROTOTYPE_METHOD(t, "deflate", GzipDeflate);
    target->Set(String::NewSymbol("Gzip"), t->GetFunction());
  }

  int GzipDeflate(char* data, int data_len, char** out, int* out_len) {    
    int ret, flush;
    char* temp;
    int i=1;
    
    // Allocate deflate state
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    
    // Just allocate default compression and return if we failed
    ret = deflateInit(&strm, Z_DEFAULT_COMPRESSION);    
    if (ret != Z_OK) return ret;
    
    // Set up temp variables
    *out = NULL;
    *out_len = 0;
    ret = 0;

    if (data_len == 0) return 0;

    while(data_len>0) {    
      
      if (data_len > CHUNK) {
	      strm.avail_in = CHUNK;
        flush = Z_NO_FLUSH;
      } else {
	      strm.avail_in = data_len;
        flush = Z_FINISH;
      }

      strm.next_in = (Bytef*)data;
      do {
        // Allocate a chunk of memory for output
	      temp = (char *)realloc(*out, CHUNK*i + 1);
	      if (temp == NULL) {
	        return Z_MEM_ERROR;
	      }
	      
	      *out = temp;	      
	      strm.avail_out = CHUNK;
        strm.next_out = (Bytef*)*out + *out_len;        
	      ret = deflate(&strm, flush);
	      assert(ret != Z_STREAM_ERROR);  /* state not clobbered */
	      *out_len += (CHUNK - strm.avail_out);
	      i++;
      } while (strm.avail_out == 0);

      data += CHUNK;
      data_len -= CHUNK;
    }
    
    // Clean up and return
    (void)deflateEnd(&strm);
    return ret;
  }

 protected:

  static Handle<Value> New (const Arguments& args) {
    HandleScope scope;

    Gzip *gzip = new Gzip();
    gzip->Wrap(args.This());
    return args.This();
  }

  static Handle<Value> GzipDeflate(const Arguments& args) {
    Gzip *gzip = ObjectWrap::Unwrap<Gzip>(args.This());

    HandleScope scope;

    enum encoding enc = ParseEncoding(args[1]);
    ssize_t len = DecodeBytes(args[0], enc);

    if (len < 0) {
      Local<Value> exception = Exception::TypeError(String::New("Bad argument"));
      return ThrowException(exception);
    }
    
    char* buf = new char[len];
    ssize_t written = DecodeWrite(buf, len, args[0], enc);
    assert(written == len);

    char* out;
    int out_size;
    int r = gzip->GzipDeflate(buf, len, &out, &out_size);

    if (out_size==0) {
      return scope.Close(String::New(""));
    }

    Local<Value> outString = Encode(out, out_size, BINARY);
    free(out);
    return scope.Close(outString);
  }

  Gzip () : EventEmitter () {
  }

  ~Gzip () {
  }

 private:
  z_stream strm;
};

class Gunzip : public EventEmitter {
 public:
   
  static void Initialize (v8::Handle<v8::Object> target) {
    HandleScope scope;
    Local<FunctionTemplate> t = FunctionTemplate::New(New);

    t->Inherit(EventEmitter::constructor_template);
    t->InstanceTemplate()->SetInternalFieldCount(1);

    NODE_SET_PROTOTYPE_METHOD(t, "inflate", GunzipInflate);
    target->Set(String::NewSymbol("Gunzip"), t->GetFunction());
  }

  int GunzipInflate(const char* data, int data_len, char** out, int* out_len) {
    int ret, flush;
    char* temp;
    int i=1;

    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    strm.avail_in = 0;
    strm.next_in = Z_NULL;
    ret = inflateInit(&strm);
    if (ret != Z_OK) return ret;

    *out = NULL;
    *out_len = 0;

    if (data_len == 0)
      return 0;

    while(data_len>0) {    
      if (data_len>CHUNK) {
	      strm.avail_in = CHUNK;
        flush = Z_NO_FLUSH;
      } else {
	      strm.avail_in = data_len;
        flush = Z_FINISH;
      }

      strm.next_in = (Bytef*)data;

      do {
	      temp = (char *)realloc(*out, CHUNK*i);	      
	      if (temp == NULL) {
	        return Z_MEM_ERROR;
	      }
	      
	      *out = temp;
        strm.avail_out = CHUNK;
	      strm.next_out = (Bytef*)*out + *out_len;
	      ret = inflate(&strm, flush);
	      assert(ret != Z_STREAM_ERROR);  /* state not clobbered */
	      switch (ret) {
	        case Z_NEED_DICT:
	          ret = Z_DATA_ERROR;     /* and fall through */
	        case Z_DATA_ERROR:
	        case Z_MEM_ERROR:
	          (void)inflateEnd(&strm);
	        return ret;
	      }
	      
	      *out_len += (CHUNK - strm.avail_out);
	      i++;
      } while (strm.avail_out == 0);
      
      data += CHUNK;
      data_len -= CHUNK;
    }
    // Close and clean up
     inflateEnd(&strm);
    return ret;
  }

 protected:

  static Handle<Value> New(const Arguments& args) {
    HandleScope scope;

    Gunzip *gunzip = new Gunzip();
    gunzip->Wrap(args.This());
    return args.This();
  }

  static Handle<Value> GunzipInflate(const Arguments& args) {
    Gunzip *gunzip = ObjectWrap::Unwrap<Gunzip>(args.This());
    HandleScope scope;

    enum encoding enc = ParseEncoding(args[1]);
    ssize_t len = DecodeBytes(args[0], enc);

    if (len < 0) {
      Local<Value> exception = Exception::TypeError(String::New("Bad argument"));
      return ThrowException(exception);
    }

    char* buf = new char[len];
    ssize_t written = DecodeWrite(buf, len, args[0], BINARY);
    assert(written == len);

    char* out;
    int out_size;
    int r = gunzip->GunzipInflate(buf, len, &out, &out_size);

    Local<Value> outString = Encode(out, out_size, enc);
    free(out);
    return scope.Close(outString);
  }

  Gunzip () : EventEmitter () {
  }

  ~Gunzip () {
  }

 private:
   z_stream strm;
};

extern "C" void
init (Handle<Object> target) 
{
  HandleScope scope;
  Gzip::Initialize(target);
  Gunzip::Initialize(target);
}
