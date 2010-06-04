import re
import Options
import sys, os, shutil

from Utils import cmd_output
from os.path import join, dirname, abspath
from logging import fatal

srcdir = "."
blddir = "build"
VERSION = "0.0.1"
cwd = os.getcwd()

def set_options(opt):
  opt.tool_options("compiler_cxx")
  opt.tool_options("compiler_cc")

def configure(conf):
  conf.check_tool("compiler_cxx")
  conf.check_tool("compiler_cc")
  conf.check_tool("node_addon")
  
  conf.env.append_value('CCFLAGS', ['-O3'])
  conf.env.append_value ('LINKFLAGS', '-lz')
  
  conf.check(lib='z', libpath=['/usr/lib', '/usr/local/lib'], uselib_store='Z')  

def build(bld):
  libgit2 = bld.new_task_gen("cc", "shlib")
  libgit2.source = """
	deps/libgit2/src/block-sha1/sha1.c
	deps/libgit2/src/unix/map.c
	deps/libgit2/src/commit.c
	deps/libgit2/src/delta-apply.c
	deps/libgit2/src/errors.c
	deps/libgit2/src/fileops.c
	deps/libgit2/src/hash.c
	deps/libgit2/src/odb.c
	deps/libgit2/src/oid.c
	deps/libgit2/src/revobject.c
	deps/libgit2/src/revwalk.c
	deps/libgit2/src/thread-utils.c
	deps/libgit2/src/util.c"""
  libgit2.includes = """deps/libgit2/src"""
  libgit2.name = "libgit2"
  libgit2.target = "libgit2"

  obj = bld.new_task_gen("cxx", "shlib", "node_addon")
  obj.target = "node-git"
  obj.source = "node-git.cc"
  # obj.uselib_local = 'z'
  # obj.uselibs = 'Z'
  obj.includes = "libgit2"
  obj.add_objects = "libgit2"  
