import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import docClient from './docClient';
import logger from '../log';
import TRRequest from '../trrequest';

class RequestTableService {
    private doc: DocumentClient;
    constructor() {
        this.doc = docClient;
    }

    /**
     * Searches the database for all requests from a specific user
     */
    async getRequestsByUser(username: string): Promise<TRRequest[]|null> {
        const params = {
            TableName: 'requests',
            KeyConditionExpression: '#user = :user',
            ExpressionAttributeNames: {
                '#user': 'username'
            },
            ExpressionAttributeValues: {
                ':user': username
            }
        };
        // Send get request to requests table
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                logger.debug(`Retrieved requests: ${JSON.stringify(data.Items)}`);
                return data.Items as TRRequest[];
            } else {
                logger.error('Could not retrieve requests from database');
                return null;
            }
        })
    }

    /**
     * Searches the database for all requests that need review from a specific user
     */
    async getReviewRequestsByUser(username: string): Promise<TRRequest[]|null> {
        const params = {
            TableName: 'requests',
            IndexName: "StatusIndex",
            KeyConditionExpression: '#next = :user',
            ExpressionAttributeNames: {
                '#next': 'nexttoapprove'
            },
            ExpressionAttributeValues: {
                ':user': username
            }
        };
        // Send get request to requests table
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                logger.debug(`Retrieved requests: ${JSON.stringify(data.Items)}`);
                return data.Items as TRRequest[];
            } else {
                logger.error('Could not retrieve requests from database');
                return null;
            }
        })
    }

    /**
     * Adds or updates a request to the database
     */
    async putRequest(request: TRRequest): Promise<boolean> {
        const params = {
            TableName: 'requests',
            Item: request
        };
        // Send put request to requests
        return await this.doc.put(params).promise().then((result) => {
            logger.info(`Added request with name "${request.eventname}" and user "${request.username}" to requests table`);
            return true;
        }).catch((error) => {
            logger.error(`Error adding request: ${error}`);
            return false;
        });
    }
}

const reqTable = new RequestTableService();
export default reqTable;
