#! /bin/bash

USER=kirtools
HOST=boethin.uberspace.de
DIR=kdapi

rsync -avz --delete . ${USER}@${HOST}:~/${DIR} --exclude=.git --exclude=node_modules --exclude=deploy.sh

# ssh ${USER}@${HOST} 'supervisorctl restart dir-server'
ssh ${USER}@${HOST} 'bash -s' <<-'ENDSSH'
    supervisorctl stop dir-server
    cd kdapi
    rm -rf node_modules
    npm install
    supervisorctl start dir-server
ENDSSH

exit 0
