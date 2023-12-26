#!/bin/bash
echo "==== START - Install ===="

# echo "> PULL SUBMODULES"
# git submodule update --init --recursive

./install_only.sh

echo "> RUN MIGRATION"
./run_migration.sh base local

echo "==== Install End Successfully ===="