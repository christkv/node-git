var gitnode = require("./build/default/node-git");
var sys = require("sys");

sys.puts(sys.inspect(gitnode.hello("/Users/christian.kvalheim/coding/projects/node-git/.git")))
