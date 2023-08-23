#!/bin/bash
echo "==== START - Install ===="

# echo "> PULL SUBMODULES"
# git submodule update --init --recursive

echo "> INSTALL ROOT"
yarn install

echo "> INSTALL LIBS"
# yarn add qbit-tech/libs-notification#latest
# yarn add qbit-tech/libs-authv3#latest
yarn add qbit-tech/libs-role#latest
yarn add qbit-tech/libs-uploader#latest
yarn add qbit-tech/libs-transaction#latest
yarn add qbit-tech/libs-faq#latest
yarn add qbit-tech/libs-payments#latest
yarn add qbit-tech/libs-products#latest
yarn add qbit-tech/feature-utils#latest

echo "> RUN MIGRATION"
./run_migration.sh base local

echo "==== Install End Successfully ===="