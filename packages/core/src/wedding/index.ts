import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  QueryCommand
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

  /**
   * Get a wedding by ID
   */
  export const getById = async (weddingId: string) => {
    try {
      const command = new QueryCommand({
        TableName: Resource.Weddings.name,
        KeyConditionExpression: "weddingId = :weddingId",
        ExpressionAttributeValues: {
          ":weddingId": weddingId
        }
      });
  
      const result = await ddb.send(command);
      if (!result.Items || result.Items.length === 0) {
        console.log("No item found for weddingId:", weddingId);
        return null;
      }

      return schema.parse(result.Items[0]);
    } catch (error) {
      console.error("Error fetching wedding by ID", error);
      throw error;
    }
  };

  /**
   * Get a wedding by custom URL
   */
  export const getByCustomUrl = async (customUrl: string) => {
    console.log("Fetching wedding by url:", customUrl, "from table:", Resource.Weddings.name);
    try {
      const command = new QueryCommand({
        TableName: Resource.Weddings.name,
        IndexName: "CustomUrlIndex",
        KeyConditionExpression: "customUrl = :customUrl",
        ExpressionAttributeValues: {
          ":customUrl": customUrl,
        },
      });

      const result = await ddb.send(command);
      if (!result.Items || result.Items.length === 0) {
        return null;
      }
      return schema.parse(result.Items[0]);
    } catch (error) {
      console.error("Error fetching wedding by custom URL", error);
      throw error;
    }
  };

    /**
   * Delete a wedding by weddingId and userId
   */
    export const deleteWedding = async (weddingId: string, userId: string) => {
      try {
        const command = new DeleteCommand({
          TableName: Resource.Weddings.name,
          Key: {
            weddingId: weddingId,
            userId: userId
          }
        });

        const result = await ddb.send(command);
        console.log('Delete wedding result:', result);
        return result;
      } catch (error) {
        console.error("Error deleting wedding", error);
        throw error;
      }
    };

    /**
     * Update a wedding
     */
    export const update = async (wedding: Partial<WeddingType> & { weddingId: string; userId: string }) => {
        try {
            // Build update expression and attribute values dynamically
            const updateExpressions: string[] = [];
            const expressionAttributeValues: Record<string, any> = {};
            const expressionAttributeNames: Record<string, string> = {};

            // Handle date field separately
            if (wedding.date !== undefined) {
                updateExpressions.push("#weddingDate = :weddingDate");
                expressionAttributeValues[":weddingDate"] = wedding.date;
                expressionAttributeNames["#weddingDate"] = "date";
            }

            // Handle updatedAt separately
            updateExpressions.push("#lastUpdated = :lastUpdated");
            expressionAttributeValues[":lastUpdated"] = new Date().toISOString();
            expressionAttributeNames["#lastUpdated"] = "updatedAt";

            // Add each provided field to the update, excluding date and updatedAt
            Object.entries(wedding).forEach(([key, value]) => {
                if (key !== "weddingId" && key !== "userId" && key !== "date" && key !== "updatedAt" && value !== undefined) {
                    if (key === "location") {
                        const attributeName = `#${key}`;
                        updateExpressions.push(`${attributeName} = :${key}`);
                        expressionAttributeValues[`:${key}`] = value;
                        expressionAttributeNames[attributeName] = key;
                    } else {
                        updateExpressions.push(`${key} = :${key}`);
                        expressionAttributeValues[`:${key}`] = value;
                    }
                }
            });

            const command = new UpdateCommand({
                TableName: Resource.Weddings.name,
                Key: {
                    weddingId: wedding.weddingId,
                    userId: wedding.userId,
                },
                UpdateExpression: `set ${updateExpressions.join(", ")}`,
                ExpressionAttributeValues: expressionAttributeValues,
                ExpressionAttributeNames: expressionAttributeNames,
                ReturnValues: "ALL_NEW",
            });

            const result = await ddb.send(command);
            return result.Attributes;
        } catch (error) {
            console.error("Error updating wedding", error);
            throw error;
        }
    };
}