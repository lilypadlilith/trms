import * as AWS from 'aws-sdk';

let docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com'
});

export default docClient;