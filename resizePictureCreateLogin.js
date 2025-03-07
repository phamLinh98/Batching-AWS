// Lambda Function 2: Handles Step 4
const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3();

exports.handler = async (event) => {
    const message = JSON.parse(event.Records[0].body);
    const batchId = message.batchId;

    try {
        await updateStatus('processing');

        const users = await getUsersByBatchId(batchId);
        for (const user of users) {
            await resizeAvatar(user);
            await createUserLogin(user);
        }

        await updateStatus('done');

        return { statusCode: 200, body: 'Success' };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: 'Error' };
    }
};

async function updateStatus(status) {
    const params = {
        TableName: 'upload_status',
        Key: { id: '1' },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status }
    };
    await DynamoDB.update(params).promise();
}

async function getUsersByBatchId(batchId) {
    const params = {
        TableName: 'user',
        FilterExpression: 'batchId = :batchId',
        ExpressionAttributeValues: { ':batchId': batchId }
    };
    const data = await DynamoDB.scan(params).promise();
    return data.Items;
}

async function resizeAvatar(user) {
    // Placeholder function for resizing avatar
    const resizedAvatar = user.avatar; // Implement actual resizing logic
    const params = {
        Bucket: 'resize-avatar',
        Key: `${user.id}.jpg`,
        Body: resizedAvatar
    };
    await S3.putObject(params).promise();
}

async function createUserLogin(user) {
    const params = {
        TableName: 'user',
        Key: { id: user.id },
        UpdateExpression: 'set username = :username, password = :password',
        ExpressionAttributeValues: {
            ':username': user.name,
            ':password': '123'
        }
    };
    await DynamoDB.update(params).promise();
}