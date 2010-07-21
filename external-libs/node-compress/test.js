var compress=require("./compress");
var sys=require("sys");
// var posix=require("posix");

// Create gzip stream
var gzip = new compress.Gzip;
var gunzip = new compress.Gunzip;

// deflate the data
var data = gzip.deflate('hello world!!', 'binary');
sys.puts(data)
// inflate the data
var data2 = gunzip.inflate(data, 'binary');
sys.puts(data2)