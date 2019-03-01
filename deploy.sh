#! /bin/bash

USER=kirtools
HOST=boethin.uberspace.de
DIR=kdapi

rsync -avz --delete . ${USER}@${HOST}:~/${DIR}

exit 0
