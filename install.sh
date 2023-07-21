#!/bin/bash
echo "==== START - Install ===="

echo "> PULL SUBMODULES"
git submodule update --init --recursive

echo "> INSTALL ROOT"
yarn install

echo "> INSTALL LIBS NOTIFICATION"
cd ./libs/libs-notification
yarn install
cd ../..

echo "> RUN MIGRATION"
./run_migration.sh

echo "==== Install End Successfully ===="