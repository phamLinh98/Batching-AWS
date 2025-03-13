// linhclass-change-avatar-lambda.js
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient({ region: "ap-northeast-1" });
const tableName = "user"; // Tên bảng DynamoDB của bạn

export const handler = async (event) => {
  console.log("Change Avatar Lambda received event:", JSON.stringify(event, null, 2));

  try {
    const { userId, imageName } = event;

    if (!userId || !imageName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing userId or imageName" }),
      };
    }

    const params = {
      TableName: tableName,
      Key: {
        "id": { S: userId }, // Thay đổi 'id' nếu primary key của bạn khác
      },
      UpdateExpression: "SET avatar = :avatar",
      ExpressionAttributeValues: {
        ":avatar": { S: imageName },
      },
      ReturnValues: "UPDATED_NEW",
    };

    const command = new UpdateItemCommand(params);
    const response = await dynamoDBClient.send(command);

    console.log("DynamoDB update response:", response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Avatar updated successfully", response }),
    };
  } catch (error) {
    console.error("Error updating avatar:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating avatar", error: error.message }),
    };
  }
};