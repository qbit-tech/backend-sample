#!/bin/bash
echo "==== START - Install ===="

# echo "> PULL SUBMODULES"
# git submodule update --init --recursive

echo "> INSTALL ROOT"
yarn install

yarn add qbit-tech/libs-authv3
yarn add qbit-tech/libs-notification
yarn add qbit-tech/libs-role
yarn add qbit-tech/libs-utils
yarn add qbit-tech/libs-uploader

# echo "> INSTALL LIBS AUTHV3"
# cd ./libs/authv3
# yarn install
# cd ../..

# echo "> INSTALL LIBS NOTIFICATION"
# cd ./libs/libs-notification
# yarn install
# cd ../..

# echo "> INSTALL LIBS UTILS"
# cd ./libs/libs-utils
# yarn install
# cd ../..

echo "> RUN MIGRATION"
./run_migration.sh base local

echo "==== Install End Successfully ===="