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
import { schema, WeddingType } from "./types";

const client = new DynamoDBClient({ region: "eu-north-1" });
const ddb = DynamoDBDocumentClient.from(client);

export { WeddingType };
export namespace Wedding {

    /**
   * Create a wedding
   */
  export const create = async (wedding: Omit<WeddingType, "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newWedding = {
      ...wedding,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const command = new PutCommand({
        TableName: Resource.Weddings.name,
        Item: newWedding,
      });

      const result = await ddb.send(command);
      console.log('create wedding result: ', result);
      return result;
    } catch (error) {
      console.error("Error creating wedding", error);
      throw error;
    }
  };

    /**
   * List all weddings for a user (userId = email)
   */
  export const listWeddingsByUserId = async (userId: string) => {
    try {
      const command = new ScanCommand({
        TableName: Resource.Weddings.name,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      });

      const result = await ddb.send(command);
      const weddings = result.Items?.map((item) => schema.parse(item)) || [];
      return weddings;
    } catch (error) {
      console.error("Error fetching weddings by user ID", error);
      throw error;
    }
  };
}