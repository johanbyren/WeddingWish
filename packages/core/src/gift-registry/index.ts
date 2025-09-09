import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  BatchWriteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst/resource";
import { schema, GiftRegistryType } from "./types";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
                    Item: {
                        giftId: gift.id,
                        weddingId: gift.weddingId,
                        name: gift.name,
                        description: gift.description,
                        price: gift.price,
                        stripePriceId: gift.stripePriceId,
                        imageUrl: gift.imageUrl,
                        totalContributed: gift.totalContributed,
                        isFullyFunded: gift.isFullyFunded,
                        createdAt: gift.createdAt,
                        updatedAt: gift.updatedAt
                    }
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
                                [Resource.GiftRegistryTable.name]: chunk
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
                result.UnprocessedItems?.[Resource.GiftRegistryTable.name] || []
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
                            TableName: Resource.GiftRegistryTable.name,
                            Key: { 
                                giftId: id,
                                weddingId: giftUpdates.weddingId
                            },
                            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
                            ExpressionAttributeValues: expressionAttributeValues,
                            ExpressionAttributeNames: expressionAttributeNames,
                            ReturnValues: "ALL_NEW",
                            ConditionExpression: "attribute_exists(giftId)",
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

    /**
     * Get all gifts for a wedding
     * @param weddingId The ID of the wedding
     * @returns Array of gifts for the wedding
     * @throws {GiftRegistryError} If DynamoDB operations fail
     */
    export const getByWeddingId = async (weddingId: string): Promise<GiftRegistryType[]> => {
        try {
            const command = new QueryCommand({
                TableName: Resource.GiftRegistryTable.name,
                IndexName: "WeddingGiftsIndex",
                KeyConditionExpression: "weddingId = :weddingId",
                ExpressionAttributeValues: {
                    ":weddingId": weddingId
                }
            });

            const result = await ddb.send(command);
            return (result.Items || []) as GiftRegistryType[];
        } catch (error) {
            throw new GiftRegistryError(
                `Failed to fetch gifts for wedding ${weddingId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
        }
    };

    /**
     * Get a specific gift by ID
     * @param giftId The ID of the gift
     * @param weddingId The ID of the wedding
     * @returns The gift if found, null otherwise
     * @throws {GiftRegistryError} If DynamoDB operations fail
     */
    export const getById = async (giftId: string, weddingId: string): Promise<GiftRegistryType | null> => {
        try {
            const command = new GetCommand({
                TableName: Resource.GiftRegistryTable.name,
                Key: {
                    giftId: giftId,
                    weddingId: weddingId
                }
            });

            const result = await ddb.send(command);
            if (!result.Item) {
                return null;
            }

            return result.Item as GiftRegistryType;
        } catch (error) {
            throw new GiftRegistryError(
                `Failed to fetch gift ${giftId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
        }
    };

    /**
     * Add a contribution to a gift
     * @param giftId The ID of the gift
     * @param weddingId The ID of the wedding
     * @param amount The amount to add to totalContributed
     * @throws {GiftRegistryError} If DynamoDB operations fail
     */
    export const addContribution = async (giftId: string, weddingId: string, amount: number) => {
        try {
            console.log(`Adding contribution of ${amount} to gift ${giftId} for wedding ${weddingId}`);
            
            // First get the current gift to check if it exists and get current totalContributed
            const currentGift = await getById(giftId, weddingId);
            if (!currentGift) {
                throw new GiftRegistryError(`Gift with id ${giftId} does not exist`);
            }

            const newTotalContributed = currentGift.totalContributed + amount;
            const isFullyFunded = currentGift.price ? newTotalContributed >= currentGift.price : false;

            // Update the gift with new contribution amount
            const updateCommand = new UpdateCommand({
                TableName: Resource.GiftRegistryTable.name,
                Key: { 
                    giftId: giftId,
                    weddingId: weddingId
                },
                UpdateExpression: "SET totalContributed = :totalContributed, isFullyFunded = :isFullyFunded, updatedAt = :updatedAt",
                ExpressionAttributeValues: {
                    ":totalContributed": newTotalContributed,
                    ":isFullyFunded": isFullyFunded,
                    ":updatedAt": new Date().toISOString()
                },
                ReturnValues: "ALL_NEW",
                ConditionExpression: "attribute_exists(giftId)",
            });

            const result = await ddb.send(updateCommand);
            console.log(`Successfully added contribution. New total: ${newTotalContributed}, Fully funded: ${isFullyFunded}`);
            
            return result.Attributes as GiftRegistryType;
        } catch (error) {
            if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
                throw new GiftRegistryError(`Gift with id ${giftId} does not exist`);
            }
            throw new GiftRegistryError(
                `Failed to add contribution to gift ${giftId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
        }
    };

    /**
     * Delete a gift and its associated image
     * @param giftId The ID of the gift to delete
     * @param weddingId The ID of the wedding
     * @throws {GiftRegistryError} If DynamoDB operations fail
     */
    export const deleteGift = async (giftId: string, weddingId: string) => {
        try {
            // First get the gift to get the image URL
            const gift = await getById(giftId, weddingId);
            if (!gift) {
                throw new GiftRegistryError(`Gift with id ${giftId} does not exist`);
            }

            // Delete the gift from DynamoDB
            const command = new DeleteCommand({
                TableName: Resource.GiftRegistryTable.name,
                Key: {
                    giftId,
                    weddingId
                }
            });

            await ddb.send(command);

            // If the gift has an image, delete it from S3
            if (gift.imageUrl) {
                // Extract the key from the CloudFront URL or use the key directly
                const key = gift.imageUrl.includes('gifts/') 
                    ? gift.imageUrl.split('/').slice(-2).join('/') // Extract from CloudFront URL
                    : gift.imageUrl; // Use the key directly

                const s3Client = new S3Client({ region: "eu-north-1" });
                const deleteCommand = new DeleteObjectCommand({
                    Bucket: Resource.WeddingAssets.name,
                    Key: `gifts/${key}`
                });

                await s3Client.send(deleteCommand);
            }

            return true;
        } catch (error) {
            throw new GiftRegistryError(
                `Failed to delete gift ${giftId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error
            );
        }
    }
}
