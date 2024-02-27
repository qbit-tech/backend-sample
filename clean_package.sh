#!/bin/bash
echo "==== START - Clean Package ===="

echo "> CLEAN LIBS"

yarn cache clean @qbit-tech/feature-utils
yarn cache clean @qbit-tech/libs-address
yarn cache clean @qbit-tech/libs-authv3
yarn cache clean @qbit-tech/libs-faq
yarn cache clean @qbit-tech/libs-notification
yarn cache clean @qbit-tech/libs-notification-scheduler
yarn cache clean @qbit-tech/libs-products
yarn cache clean @qbit-tech/libs-article
yarn cache clean @qbit-tech/libs-sponsor
yarn cache clean @qbit-tech/libs-promo
yarn cache clean @qbit-tech/libs-role
yarn cache clean @qbit-tech/libs-session
yarn cache clean @qbit-tech/libs-transaction
yarn cache clean @qbit-tech/libs-payments
yarn cache clean @qbit-tech/libs-uploader
yarn cache clean @qbit-tech/libs-utils

echo "==== Clean Package End Successfully ===="