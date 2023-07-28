#!/bin/bash

if [ -z "$1" ]
then
  echo -n "Project: "
  read PROJECT
else
  echo "Project: $1"
  PROJECT="$1"
fi

if [ -z "$2" ]
then
  echo -n "Mode (local | development | staging | production): "
  read MODE
else
  echo "Mode: $2"
  MODE="$2"
fi


if [ -z "$PROJECT" ]
then
  echo "Project Not Found"
  exit
fi

if [ -z "$MODE" ]
then
  MODE="local"
fi

echo "----- Migration: Started -----"

# if [ -f ./apps/$PROJECT/.env.$MODE ]
# then
#   # Load Environment Variables
#   export $(cat ./apps/$PROJECT/.env.$MODE | grep -v '#' | awk '/=/ {print $1}')
#   # For instance, will be example_kaggle_key
#   SERVER=$IP_SERVER

#   if [ -z "$INCLUDE_LIBS" ]
#   then
#     INCLUDE_LIBS="-"
#   else
#     INCLUDE_LIBS=$INCLUDE_LIBS
#   fi
  
#   echo "$INCLUDE_LIBS"
# fi

echo "===== Migrate DB Lib/Authv3 ====="
cd ./libs/authv3
ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../..

# cd ./libs/libs-notification
# ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
# cd ../..

# echo "===== Migrate DB Lib/Uploader ====="
# cd libs/uploader
# ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
# cd ../..

# echo "===== Migrate DB Lib/AppVersion ====="
# cd libs/appVersion
# ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
# cd ../..

echo "===== Migrate DB Lib/Utils (appConfig, appVersion) ====="
cd ./node_modules/@qbit-tech/libs-utils/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo "===== Migrate DB Project ====="
cd apps/$PROJECT
ENV_PATH=.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../..

echo "----- Migration: Finished -----"