import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst/resource";
import { schema, GiftRegistryType } from "./types";

const client = new DynamoDBClient({ region: "eu-north-1" });
const ddb = DynamoDBDocumentClient.from(client);

export class GiftRegistryError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'GiftRegistryError';
  }
}

export namespace GiftRegistry {
    /**
     * Create multiple gifts
     * @throws {GiftRegistryError} If validation fails or DynamoDB operations fail
     */
    export const create = async (gifts: Omit<GiftRegistryType, "createdAt" | "updatedAt">[]) => {
        try {
            if (!gifts || gifts.length === 0) {
                throw new GiftRegistryError('No gifts provided');
            }

            console.log('Creating gifts: ', gifts);
            const now = new Date().toISOString();
            
            // Validate all gifts before processing
            const validationResults = await Promise.all(
                gifts.map(async (gift) => {
                    try {
                        return await schema.parseAsync({
                            ...gift,
                            createdAt: now,
                            updatedAt: now,
                        });
                    } catch (error) {
                        throw new GiftRegistryError(
                            `Invalid gift data for gift with id ${gift.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            error
                        );
                    }
                })
            );

            // Prepare batch write items
            const batchWriteItems = validationResults.map((gift: GiftRegistryType) => ({
                PutRequest: {
                    Item: gift
                }
            }));

            // Split into chunks of 25 (DynamoDB batch write limit)
            const chunks = [];
            for (let i = 0; i < batchWriteItems.length; i += 25) {
                chunks.push(batchWriteItems.slice(i, i + 25));
            }

            // Execute batch writes
            const results = await Promise.all(
                chunks.map(async (chunk, index) => {
                    try {
                        return await ddb.send(new BatchWriteCommand({
                            RequestItems: {
                                [process.env.TABLE_NAME || "GiftRegistry"]: chunk
                            }
                        }));
                    } catch (error) {
                        throw new GiftRegistryError(
                            `Failed to write batch ${index + 1} of ${chunks.length}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            error
                        );
                    }
                })
            );

            // Check for unprocessed items
            const unprocessedItems = results.flatMap(result => 
                result.UnprocessedItems?.[process.env.TABLE_NAME || "GiftRegistry"] || []
            );

            if (unprocessedItems.length > 0) {
                throw new GiftRegistryError(
                    `Failed to process ${unprocessedItems.length} items. Please retry.`
                );
            }

            return validationResults;
        } catch (error) {
            if (error instanceof GiftRegistryError) {
                throw error;
            }
            throw new GiftRegistryError(
                'Failed to create gifts',
                error
            );
        }
    }

    /**
     * Update one or more gifts
     * @param updates Array of objects containing gift id and the fields to update
     * @throws {GiftRegistryError} If validation fails or DynamoDB operations fail
     */
    export const update = async (updates: Array<{
        id: string;
        updates: Partial<Omit<GiftRegistryType, "id" | "createdAt" | "updatedAt">>;
    }>) => {
        try {
            if (!updates || updates.length === 0) {
                throw new GiftRegistryError('No updates provided');
            }

            console.log('Updating gifts: ', updates);
            const now = new Date().toISOString();

            // Process updates in parallel
            const results = await Promise.all(
                updates.map(async ({ id, updates: giftUpdates }) => {
                    try {
                        // Validate the update data
                        const updateData = {
                            ...giftUpdates,
                            updatedAt: now,
                        };

                        // Create update expression and attribute values
                        const updateExpressions: string[] = [];
                        const expressionAttributeValues: Record<string, any> = {};
                        const expressionAttributeNames: Record<string, string> = {};

                        Object.entries(updateData).forEach(([key, value]) => {
                            if (value !== undefined) {
                                const attributeName = `#${key}`;
                                const attributeValue = `:${key}`;
                                updateExpressions.push(`${attributeName} = ${attributeValue}`);
                                expressionAttributeValues[attributeValue] = value;
                                expressionAttributeNames[attributeName] = key;
                            }
                        });

                        if (updateExpressions.length === 0) {
                            throw new GiftRegistryError(`No valid updates provided for gift ${id}`);
                        }

                        const updateCommand = new UpdateCommand({
                            TableName: process.env.TABLE_NAME || "GiftRegistry",
                            Key: { id },
                            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
                            ExpressionAttributeValues: expressionAttributeValues,
                            ExpressionAttributeNames: expressionAttributeNames,
                            ReturnValues: "ALL_NEW",
                            ConditionExpression: "attribute_exists(id)",
                        });

                        const result = await ddb.send(updateCommand);
                        return result.Attributes as GiftRegistryType;
                    } catch (error) {
                        if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
                            throw new GiftRegistryError(`Gift with id ${id} does not exist`);
                        }
                        throw new GiftRegistryError(
                            `Failed to update gift ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            error
                        );
                    }
                })
            );

            return results;
        } catch (error) {
            if (error instanceof GiftRegistryError) {
                throw error;
            }
            throw new GiftRegistryError(
                'Failed to update gifts',
                error
            );
        }
    }
}
