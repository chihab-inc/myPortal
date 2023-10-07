#!/bin/sh

## USE THIS SCRIPT EVERYTIME YOU DECIDE TO MAKE A FINAL PUSH TO BRANCH THAT WILL BE MERGED INTO THE MAIN BRANCH
## THIS SCRIPT WILL REPLACE OR ADD VERSIONS OF NODE BINARIES FOR BOTH LINUX, MACOS, AND WINDOWS TO THE DIRECTORY
## IT WILL ALSO NPM UINSTALL ANY NEWLY ADDED MODULES SO THAT THE USER DOESN'T HAVE TO DO THAT

# THIS IS DEV ENVIRONMENT
# CREATE myPortal
mkdir myPortal && \
# COPY public INTO myPortal
cp -R public/ myPortal/ && \
# REMOVE script.js FROM myPortal
rm myPortal/public/script.js && \
# COPY run-xxx.xx INTO myPortal
cp run-linux.sh run-macos.sh run-windows.bat myPortal/ && \
# COPY README.md INTO myPortal
cp README.md myPortal/ && \
# COPY index.js INTO myPortal
cp index.js myPortal/ && \
# Bundle frontend app
npm run build && \

# PREPARING MODULE INSTALL
# check if package-lock.json exists and if so remove to it overwrite later with a more recent version
if [ -f "package-lock.json" ]; then
  rm package-lock.json
fi && \
# check if package-lock.json exists and if so remove to it overwrite later with a more recent version
if [ -f "package-lock.json" ]; then
  rm package-lock.json
fi && \
# check if node_modules exists and if so remove to it overwrite later with a more recent version
if [ -f "node_modules" ]; then
  rm -rf node_modules
fi && \
npm cache clean --force && \
echo '[ NPM INSTALL ]' && \
npm install --save && \

# PREPARING USER ENVIRONMENT
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

# COPY node_modules INTO myPortal
cp -R node_modules myPortal && \
# COPY node INTO myPortal
mv node myPortal && \
# REMOVE OLDER myPortal.zip IF EXISTS
if [ -f "myPortal.zip" ]; then
  rm myPortal.zip
fi && \
# ZIP myPortal INTO myPortal.zip
zip -r myPortal.zip myPortal && \
# REMOVE myPortal (directory)
rm -R myPortal && \

echo 'DONE'