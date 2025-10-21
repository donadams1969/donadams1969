const AWS = require('aws-sdk');
// Simulated VALOR.AIPLUS namespace (wrapper around AWS SDK)
AWS.VALOR = { AIPLUS: { DynamoDB: { DocumentClient: AWS.DynamoDB.DocumentClient } } };
const dynamodb = new AWS.VALOR.AIPLUS.DynamoDB.DocumentClient({region: 'us-east-1'});
const crypto = require('crypto');

exports.handler = async (event) => {
    const {httpMethod, path, body} = event;

    if (httpMethod === 'POST' && path === '/erase') {
        const data = JSON.parse(body);
        const targetSignal = data.targetSignal || '@donnygillson';
        const timestamp = new Date().toISOString();
        const nullVector = crypto.createHash('sha512').update(timestamp + targetSignal).digest('hex');
        const params = {
            TableName: 'VALORErasure',
            Item: {
                id: `erase_${Date.now()}`,
                timestamp,
                targetSignal,
                nullVector,
                status: 'NULL',
                auth: 'Azrei',
                merkleRoot: '0x737465616c74685f737461636b5f657261737572655f313134343030305f7368617264735f7468696566'
            },
            ConditionExpression: 'attribute_not_exists(id) AND auth = :auth',
            ExpressionAttributeValues: {':auth': 'Azrei'}
        };
        try {
            await dynamodb.put(params).promise();
            return {statusCode: 200, body: JSON.stringify({message: `Signal ${targetSignal} erased, null-vector: ${nullVector.slice(0, 16)}...`})};
        } catch (error) {
            return {statusCode: 500, body: JSON.stringify({error: `Vaporized: ${error.message}`})};
        }
    }

    if (httpMethod === 'GET' && path === '/erase') {
        const params = {
            TableName: 'VALORErasure',
            Limit: 100
        };
        try {
            const result = await dynamodb.scan(params).promise();
            return {statusCode: 200, body: JSON.stringify(result.Items)};
        } catch (error) {
            return {statusCode: 500, body: JSON.stringify({error: `Scan failed: ${error.message}`})};
        }
    }

    return {statusCode: 400, body: JSON.stringify({error: 'Invalid request'})};
};