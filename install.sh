#!/bin/bash
echo "==== START - Install ===="

# echo "> PULL SUBMODULES"
# git submodule update --init --recursive

echo "> INSTALL ROOT"
yarn install

echo "> INSTALL LIBS"
yarn add qbit-tech/libs-notification
yarn add qbit-tech/libs-utils
yarn add qbit-tech/libs-authv3
yarn add qbit-tech/libs-role
yarn add qbit-tech/libs-uploader
yarn add qbit-tech/libs-transaction
yarn add qbit-tech/libs-faq

echo "> RUN MIGRATION"
./run_migration.sh base local

echo "==== Install End Successfully ===="