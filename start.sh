#!/bin/bash

sudo apt update
sudo apt install nodejs
node -v
sudo apt install npm
npm -v

npm install
npm run dev
