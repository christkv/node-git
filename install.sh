cd ./external-libs/node-compress
rm -rf ./build
rm compress.node
node-waf configure
node-waf build
cd ..
cd ..