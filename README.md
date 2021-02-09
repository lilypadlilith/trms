# Tuition Reimbursement Management Software
Revature Project 1

## Description
TRMS, or Tuition Reimbursement Management System is a full-stack web application that allows employees to submit requests for reimbursements for courses, events, and certifications. These requests can then be approved or rejected by the employee's direct supervisor, department head, and a benefits coordinator while the employee is able to track the status of their requests.

## Technologies Used
* Node.js - v.14.15.1
* TypeScript - v.4.1.3
* Express.js - v.4.16.1
* DynamoDB
* React - v.17.0.1
* HTML/CSS
* Redux - v.4.0.5

## Features
* Existing employees can log in to submit reimuburement requests and view requests they have previously submitted
* Form input must be validated before a form can be submitted
* Projected reimbursement amounts are calculated/displayed based on event type and previous reimbursement amounts
* Superiors can view a list of requests pending their approval
* Pending reqests can be approved and sent to the next employee in the pipeline, or declined and marked appropriately

## Setup
### Back end server
* Install the AWS CLI and configure a programatic IAM user with full access to DynamoDB
* Navigate to `trms-backend`
* Install dependecies with `npm install`
* Add a `.env` file with the following:
```
PORT=3001
CLIENT=http://localhost:3000
```
* Run table setup with `npm run init`
* Run server with `npm start`

### Front end server
* Navigate to `trms-frontend`
* Install dependencies with `npm install`
* Add a `.env` file with the following:
```
PORT=3000
REACT_APP_SERVER_URI=http://localhost:3001/
```
* Run server with `npm start`

## Usage
* View in browser on `http://localhost:3000/`
