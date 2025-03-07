// resizePictureCreateLogin.js
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { UpdateItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import pkg from "@aws-sdk/client-dynamodb";
var { DynamoDBClient, PutItemCommand } = pkg;
var DynamoDB = new DynamoDBClient();
var S3 = new S3Client();
var handler = async (event) => {
  const message = JSON.parse(event.Records[0].body);
  const batchId = message.batchId;
  try {
    console.log("No 1");
    const params = {
      TableName: "upload_status",
      Item: {
        id: { S: "1" },
        status: { S: "processing" }
      }
    };
    console.log("Put Item Params:", JSON.stringify(params, null, 2));
    await DynamoDB.send(new PutItemCommand(params));
    console.log("No 2");
    const users = await getUsersByBatchId(batchId);
    console.log("No 3");
    for (const user of users) {
      await resizeAvatar(user);
      await createUserLogin(user);
      console.log("No 4");
    }
    await updateStatus("done");
    console.log("No 5");
    return { statusCode: 200, body: "Success" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Error" };
  }
};
async function getUsersByBatchId(batchId) {
  const params = {
    TableName: "user",
    FilterExpression: "batchId = :batchId",
    ExpressionAttributeValues: { ":batchId": batchId }
  };
  const data = await DynamoDB.send(new ScanCommand(params));
  return data.Items;
}
async function resizeAvatar(user) {
  const getObjectParams = {
    Bucket: "linhclass-upload-csv-user-info-bucket",
    Key: "linh.png"
  };
  const originalImage = await S3.send(new GetObjectCommand(getObjectParams));
  const putObjectParams = {
    Bucket: "linhclass-s3-resize-image-bucket",
    Key: `${user.id}.jpg`,
    Body: originalImage.Body
  };
  await S3.send(new PutObjectCommand(putObjectParams));
}
async function createUserLogin(user) {
  const params = {
    TableName: "user",
    Key: { id: user.id },
    UpdateExpression: "set username = :username, password = :password",
    ExpressionAttributeValues: {
      ":username": user.name,
      ":password": "123"
    }
  };
  await DynamoDB.send(new UpdateItemCommand(params));
}
export {
  handler
};
