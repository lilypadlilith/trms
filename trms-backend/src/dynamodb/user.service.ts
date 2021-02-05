import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import docClient from './docClient';
import logger from '../log';
import User from '../user';

class UserTableService {
    private doc: DocumentClient;
    constructor() {
        this.doc = docClient;
    }

    /**
     * Searches the database for a specific user given their username
     */
    async getUser(username: string): Promise<User|null> {
        const params = {
            TableName: 'users',
            Key: {
                'username': username
            }
        };
        // Send get request to users table
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                logger.debug(`Retrieved user: ${JSON.stringify(data.Item)}`);
                return data.Item as User;
            } else {
                logger.error('Could not retrieve user from database');
                return null;
            }
        })
    }

    /**
     * Adds a user to the database, given one with the same username doesn't already exist
     */
    async addUser(user: User): Promise<boolean> {
        const params = {
            TableName: 'users',
            Item: user,
            ConditionExpression: '#username <> :name', // Do not add if this username already exists
            ExpressionAttributeNames: {
                '#username': 'username'
            },
            ExpressionAttributeValues: {
                ':name': user.username
            }
        };
        // Send put request to users
        return await this.doc.put(params).promise().then((result) => {
            logger.info(`Added user "${user.username}" to users table`);
            return true;
        }).catch((error) => {
            logger.error(`Error adding user: ${error}`);
            return false;
        });
    }
}

const userTable = new UserTableService();
export default userTable;
