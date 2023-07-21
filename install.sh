#!/bin/bash
echo "==== START - Install ===="

echo "> INSTALL ROOT"
yarn install

echo "> INSTALL LIBS NOTIFICATION"
cd ./libs/libs-notification
yarn install
cd ../..

echo "==== Install End Successfully ===="