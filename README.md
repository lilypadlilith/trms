# Tuition Reimbursement Management Software
Revature Project 1

## Setup to run locally
### Back end server
* Set up the AWS CLI and configure a programatic IAM user with full access to DynamoDB
* Install dependecies with `npm install`
* Add a `.env` file with the following:
```
PORT=3001
CLIENT=http://localhost:3000
```
* Run table setup with `npm run init`
* Run server with `npm start`
### Front end server
* Install dependencies with `npm install`
* Add a `.env` file with the following:
```
PORT=3000
REACT_APP_SERVER_URI=http://localhost:3001/
```
* Run server with `npm start`
* View in browser on `http://localhost:3000/`
