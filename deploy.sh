#! /bin/bash

USER=kirtools
HOST=boethin.uberspace.de
DIR=kdapi

# cd api
# ./curl_github.sh
# cd ..

rsync -avz --delete . ${USER}@${HOST}:~/${DIR}

exit 0
