#!/bin/bash
echo -n "Project: "
read PROJECT
echo -n "Mode (local | development | staging | production): "
read MODE

if [ -z "$PROJECT" ]
then
  echo "Project Not Found"
  exit
fi

if [ -z "$MODE" ]
then
  MODE="staging"
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

# echo "===== Migrate DB Lib/Uploader ====="
# cd libs/uploader
# ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
# cd ../..

# echo "===== Migrate DB Lib/AppVersion ====="
# cd libs/appVersion
# ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
# cd ../..

# echo "===== Migrate DB Lib/appConfig ====="
# cd libs/appConfig
# ENV_PATH=../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
# cd ../..

echo "===== Migrate DB Project ====="
cd apps/$PROJECT
ENV_PATH=.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../..

echo "----- Migration: Finished -----"