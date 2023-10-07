#!/bin/sh

## USE THIS SCRIPT EVERYTIME YOU DECIDE TO MAKE A FINAL PUSH TO BRANCH THAT WILL BE MERGED INTO THE MAIN BRANCH
## THIS SCRIPT WILL REPLACE OR ADD VERSIONS OF NODE BINARIES FOR BOTH LINUX, MACOS, AND WINDOWS TO THE DIRECTORY
## IT WILL ALSO NPM UINSTALL ANY NEWLY ADDED MODULES SO THAT THE USER DOESN'T HAVE TO DO THAT

# check if package-lock.json exists and if so remove to it overwrite later with a more recent version
if [ -f "package-lock.json" ]; then
  rm package-lock.json
fi && \
# check if node_modules exists and if so remove to it overwrite later with a more recent version
if [ -f "node_modules" ]; then
  rm -rf node_modules
fi && \
echo '[ NPM INSTALL ]' && \
npm install --save && \

mkdir -p node

echo '[ DOWNLOADING NODE ]' && \
# check if node.exe exists and if so remove to it overwrite later with a more recent version
if [ -f "node/node.exe" ]; then
  rm node/node.exe
fi && \
wget https://nodejs.org/dist/latest/win-x86/node.exe && \ 
mv node.exe node/node.exe && \

# check if node exists and if so remove to it overwrite later with a more recent version
if [ -f "node/node-linux" ]; then
  rm node/node-linux
fi && \
wget https://nodejs.org/dist/latest/node-v20.8.0-linux-x64.tar.gz && \ 
tar -xzf node-v20.8.0-linux-x64.tar.gz && \ 
rm node-v20.8.0-linux-x64.tar.gz && \ 
cp node-v20.8.0-linux-x64/bin/node ./node/node-linux && \ 
rm -R node-v20.8.0-linux-x64/ && \

# check if node exists and if so remove to it overwrite later with a more recent version
if [ -f "node/node-darwin" ]; then
  rm node/node-darwin
fi && \
wget https://nodejs.org/dist/latest/node-v20.8.0-darwin-x64.tar.gz && \ 
tar -xzf node-v20.8.0-darwin-x64.tar.gz && \ 
rm node-v20.8.0-darwin-x64.tar.gz && \ 
cp node-v20.8.0-darwin-x64/bin/node ./node/node-darwin && \ 
rm -R node-v20.8.0-darwin-x64/ && \

echo 'DONE'