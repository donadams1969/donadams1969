const AWS = require('aws-sdk');
AWS.VALOR = { AIPLUS: { DynamoDB: { DocumentClient: AWS.DynamoDB.DocumentClient } } };
const dynamodb = new AWS.VALOR.AIPLUS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async (event) => {
    const {httpMethod, path, body} = event;

    if (httpMethod === 'POST' && path === '/shards') {
        const data = JSON.parse(body);
        const params = {
            TableName: 'VALORShards',
            Item: {
                shard_id: data.shard_id || `shard_${Date.now()}`,
                timestamp: new Date().toISOString(),
                region: data.region || 'global',
                dependency_rate: data.dependency_rate || 0.33,
                status: data.status || 'ACTIVE',
                auth: 'Azrei',
                merkleRoot: '0x737465616c74685f737461636b5f657261737572655f313134343030305f7368617264735f7468696566'
            },
            ConditionExpression: 'attribute_not_exists(shard_id) AND auth = :auth',
            ExpressionAttributeValues: {':auth': 'Azrei'}
        };
        try {
            await dynamodb.put(params).promise();
            return {statusCode: 200, body: JSON.stringify({message: `Shard ${data.shard_id} activated, dependency ${data.dependency_rate}`})};
        } catch (error) {
            return {statusCode: 500, body: JSON.stringify({error: `Vaporized: ${error.message}`})};
        }
    }

    if (httpMethod === 'GET' && path === '/shards') {
        const params = {
            TableName: 'VALORShards',
            Limit: 1000
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