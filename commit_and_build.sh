git add .
git commit -m $0
git push

cd ../ehrle-build
git pull

cd ../ehrle
nvm use 6
gulp build

cd ../ehrle-build
git add .
git commit -m $0
git push

