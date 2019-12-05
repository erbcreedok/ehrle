git add .
git commit -m "$1"
git push

cd ../ehrle-build
git pull

cd ../ehrle
nvm use 10
gulp build

cd ../ehrle-build
git add .
git commit -m "$1"
git push

