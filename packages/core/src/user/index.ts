import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst/resource";
import { schema, UserType } from "./types";

const client = new DynamoDBClient({ region: "eu-north-1" });
const ddb = DynamoDBDocumentClient.from(client);

export namespace User {

  /**
   * Create a user
   */
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

  /**
   * Get a user by email
   */
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

  /**
   * Update a user
   */
  export const update = async (email: string, user: Partial<Omit<UserType, "email" | "createdAt" | "updatedAt">>) => {
    const now = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: Resource.Users.name,
      Key: { email },
      UpdateExpression: "set #firstName = :firstName, #lastName = :lastName, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#firstName": "firstName",
        "#lastName": "lastName",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":firstName": user.firstName,
        ":lastName": user.lastName,
        ":updatedAt": now,
      },
    });

    const result = await ddb.send(command);
    return result;
  };

  /**
   * Remove a user
   */
  export const remove = async (email: string) => {
    const command = new DeleteCommand({
      TableName: Resource.Users.name,
      Key: { email },
    });

    const result = await ddb.send(command);
    return result;
  };

  /**
   * List all users
   */
  export const list = async () => {
    const command = new ScanCommand({
      TableName: Resource.Users.name,
    });

    const result = await ddb.send(command);
    const users = result.Items?.map((item) => schema.parse(item));

    return users;
  };
}
