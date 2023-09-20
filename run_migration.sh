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

echo "--- Migration: Started ---"

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

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-authv3 ==="
cd ./node_modules/@qbit-tech/libs-authv3/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-role ==="
cd ./node_modules/@qbit-tech/libs-role/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-notification ==="
cd ./node_modules/@qbit-tech/libs-notification/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-utils (appConfig, appVersion) ==="
cd ./node_modules/@qbit-tech/libs-utils/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-faq ==="
cd ./node_modules/@qbit-tech/libs-faq/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-uploader ==="
cd ./node_modules/@qbit-tech/libs-uploader/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-transaction ==="
cd ./node_modules/@qbit-tech/libs-transaction/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-products ==="
cd ./node_modules/@qbit-tech/libs-products/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-address ==="
cd ./node_modules/@qbit-tech/libs-address/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-notification-scheduler ==="
cd ./node_modules/@qbit-tech/libs-notification-scheduler/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-subscription ==="
cd ./node_modules/@qbit-tech/libs-subscription/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB @qbit-tech/libs-payments ==="
cd ./node_modules/@qbit-tech/libs-payments/dist
ENV_PATH=../../../../apps/$PROJECT/.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../../../..

echo -ne '\n'
echo "=== MIGRATE DB Project ==="
cd apps/$PROJECT
ENV_PATH=.env.$MODE npx sequelize-cli db:migrate --env $MODE
cd ../..

echo -ne '\n'
echo "--- Migration: Finished ---"