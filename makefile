all:
	node-waf -v configure build
tests:
	node ./test.js
install:
	cp ./build/default/node-git.node /usr/local/lib/node/libraries/node-git.node
clean:
	rm -rf ./build
