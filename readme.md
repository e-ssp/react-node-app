## To run xpress server 
npx babel-node src/server.js

## for post request -- body parser
npm install --save body-parser


## To avoid restarting server 
npm install --save-dev nodemon
npx nodemon --exec npx babel-node src/server.js 

# Instal mongo on back-end
npm install --save mongodb


## MOngoDB
- Install MongoDB from (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- Start 
    sudo systemctl start mongod
- Stop 
    sudo systemctl stop mongod
- Check status 
    sudo systemctl status mongod

## To make fetch work in IE
npm install --save-dev whatwg-fetch
