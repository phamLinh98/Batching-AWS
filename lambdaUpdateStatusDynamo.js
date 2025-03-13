// Lambda Function 2: Handles Step 4
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { UpdateItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import pkg from "@aws-sdk/client-dynamodb";
const { DynamoDBClient, PutItemCommand } = pkg;

const DynamoDB = new DynamoDBClient();

export const handler = async (event) => {
    const message = JSON.parse(event.Records[0].body);
    const batchId = message.batchId;

    try {
        console.log(`No 1 - Batch ID: ${batchId} - message: ${JSON.stringify(message)}`);
        // Update dynamoDB status
        const params = {
            TableName: 'upload-status',
            Item: {
                id: { S: '1' },
                status: { S: 'testing' }
            }
        };

        console.log('Put Item Params:', JSON.stringify(params, null, 2)); // Log the params for debugging

        await DynamoDB.send(new PutItemCommand(params));

        console.log('No 2 - Update DynamoDB status to processing');
        return { statusCode: 200, body: 'Success' };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: 'Error' };
    }
};