import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst/resource";
import { schema, UserType } from "./types";

const client = new DynamoDBClient({ region: "eu-north-1" });
const ddb = DynamoDBDocumentClient.from(client);

export namespace User {
  export const create = async (user: Omit<UserType, "createdAt" | "updatedAt">) => {
    console.log('create user: ', user);
    const now = new Date().toISOString();
    const newUser = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const command = new PutCommand({
        TableName: Resource.Users.name,
        Item: newUser,
      });

      const result = await ddb.send(command);
      console.log('create user result: ', result);
      return result;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  };

  export const get = async (email: string) => {
    console.log('get user: ', email);
    console.log('get user resource: ', Resource.Users.name);
    const command = new GetCommand({
      TableName: Resource.Users.name,
      Key: { email },
    });
    console.log('get user command: ', command);

    const result = await ddb.send(command);
    console.log('get user result: ', result);

    if (!result.Item) {
      return null;
    }
    const user = schema.parse(result.Item);

    return user;
  };

  export const getByEmail = async (email: string) => {
    const command = new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: "emailIndex",
      KeyConditionExpression: "emailIndex = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase(),
      },
    });

    const result = await ddb.send(command);

    if (!result.Items?.[0]) {
      return null;
    }
    const user = schema.parse(result.Items[0]);

    return user;
  };

  export const update = async (userId: string, user: Partial<Omit<UserType, "userId" | "createdAt" | "updatedAt">>) => {
    const now = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { userId },
      UpdateExpression: "set #firstName = :firstName, #lastName = :lastName, #email = :email, #emailIndex = :emailIndex, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#firstName": "firstName",
        "#lastName": "lastName",
        "#email": "email",
        "#emailIndex": "emailIndex",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":firstName": user.firstName,
        ":lastName": user.lastName,
        ":email": user.email,
        ":emailIndex": user.email?.toLowerCase(),
        ":updatedAt": now,
      },
    });

    const result = await ddb.send(command);
    return result;
  };

  export const remove = async (userId: string) => {
    const command = new DeleteCommand({
      TableName: Resource.Users.name,
      Key: { userId },
    });

    const result = await ddb.send(command);
    return result;
  };

  export const list = async () => {
    const command = new QueryCommand({
      TableName: Resource.Users.name,
      IndexName: "listIndex",
      KeyConditionExpression: "listIndex = :listIndex",
      ExpressionAttributeValues: {
        ":listIndex": "USER", // Constant value for the listIndex
      },
    });

    const result = await ddb.send(command);
    const users = result.Items?.map((item) => schema.parse(item));

    return users;
  };
}
