#!/bin/bash
echo "==== START - Install ===="

echo "> INSTALL ROOT"
yarn install

echo "> INSTALL LIBS"
yarn add @qbit-tech/feature-utils
yarn add @qbit-tech/libs-address
yarn add @qbit-tech/libs-authv3
yarn add @qbit-tech/libs-faq
yarn add @qbit-tech/libs-notification
yarn add @qbit-tech/libs-notification-scheduler
yarn add @qbit-tech/libs-products
yarn add @qbit-tech/libs-role
yarn add @qbit-tech/libs-session
yarn add @qbit-tech/libs-transaction
yarn add @qbit-tech/libs-payments
yarn add @qbit-tech/libs-uploader
yarn add @qbit-tech/libs-utils

echo "==== Install End Successfully ===="