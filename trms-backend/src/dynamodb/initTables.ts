import * as AWS from 'aws-sdk';
import logger from '../log';
import User from '../user';
import userService from './user.service';

// Set the region
AWS.config.update({ region: 'us-east-2' });

// Create a DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// Define the tables to be created
const userTableInput: AWS.DynamoDB.CreateTableInput = {
    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};

const reqTableInput: AWS.DynamoDB.CreateTableInput = {
    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        },
        {
            AttributeName: 'eventname',
            AttributeType: 'S'
        },
        {
            AttributeName: 'nexttoapprove',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'eventname',
            KeyType: 'RANGE'
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'requests',
    StreamSpecification: {
        StreamEnabled: false
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'StatusIndex',
            KeySchema: [
                {
                    AttributeName: 'nexttoapprove',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'eventname',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ]
}

createTable('users', userTableInput, ()=>{
    userService.addUser(new User('emmett', 'pass', 'Emmett Ployee', 'employee', 'derek')).then(()=>{});
    userService.addUser(new User('derek', 'pass', 'Derek Supervisor', 'supervisor', 'deb')).then(()=>{});
    userService.addUser(new User('deb', 'pass', 'Deborah Head', 'depthead', 'ben')).then(()=>{});
    userService.addUser(new User('ben', 'pass', 'Ben Coordinator', 'benco', 'lilith')).then(()=>{});
});

createTable('requests', reqTableInput);

/**
 * Creates a table named "tableName" after deleting one of the same name if it already exists.
 * The "TableName" attribute in "tableInput" should match the "tableName" paramter
 */
function createTable(tableName: string, tableInput: AWS.DynamoDB.CreateTableInput, callback?: Function) {
    // Specify the table to check/delete
    const tableNameInput = {
        TableName: tableName
    };
    // Check if the table already exists in the database
    ddb.describeTable(tableNameInput, (err, data) => {
        if(err) {
            if(err.code === 'ResourceNotFoundException') {
                // Table doesn't exist, create it
                logger.info(`Table "${tableName}" does not yet exist`);
                setTimeout(()=>{
                    ddb.createTable(tableInput, (err, data) => {
                        if (err) {
                            logger.error(`Error creating table "${tableName}": ${err}`);
                        } else {
                            logger.info(`Table "${tableName}" created`);
                            if(callback) {
                                setTimeout(()=>{
                                    callback();
                                }, 5000);
                            }
                        }
                    });
                }, 5000);
            }
            else {
                // Another unexpected error happened
                logger.error(`Error describing table "${tableName}": ${err}`);
            }
        } else {
            logger.info(`Table "${tableName}" already exists`);
            // Table found, delete it before creating a new one
            setTimeout(()=> {
                ddb.deleteTable(tableNameInput, (err, data) => {
                    if(err) {
                        logger.error(`Error deleting table "${tableName}": ${err}`);
                    } else {
                        logger.info(`Table "${tableName}" deleted`);
                    }
                    // Create a new table
                    setTimeout(()=>{
                        ddb.createTable(tableInput, (err, data) => {
                            if (err) {
                                logger.error(`Error creating table "${tableName}": ${err}`);
                            } else {
                                logger.info(`Table "${tableName}" recreated`);
                                if(callback) {
                                    setTimeout(()=>{
                                        callback();
                                    }, 5000);
                                }
                            }
                        });
                    }, 5000);
                });
            }, 5000);
        }
    })
}
