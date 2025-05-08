import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { settingsSchema, SettingsType } from "./types";
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


const client = new DynamoDBClient({ region: "eu-north-1" });
const ddb = DynamoDBDocumentClient.from(client);

export { SettingsType, settingsSchema };

export namespace Settings {
    
    /**
     * Get settings for a user
     */
    export const get = async (userId: string, email: string): Promise<SettingsType | null> => {
        try {
            const command = new GetCommand({
                TableName: Resource.SettingsTable.name,
                Key: { 
                    userId,
                    email
                },
            });

            const result = await ddb.send(command);
            return result.Item as SettingsType || null;
        } catch (error) {
            console.error("Error getting settings:", error);
            throw error;
        }
    }

    /**
     * Save/Update settings
     */
    export const save = async (settings: Partial<SettingsType> & { userId: string; email: string }) => {
        const now = new Date().toISOString();
        
        // Get existing settings
        const existingSettings = await get(settings.userId, settings.email);
        
        // Merge existing settings with new settings
        const newSettings = {
            ...existingSettings,
            ...settings,
            updatedAt: now,
            // Only set createdAt if it's a new record
            createdAt: existingSettings?.createdAt || now,
        };

        console.log('newSettings: ', newSettings)

        try {
            const command = new PutCommand({
                TableName: Resource.SettingsTable.name,
                Item: newSettings,
            }); 

            const result = await ddb.send(command);
            console.log('save settings result: ', result);
            return result;
        } catch (error) {
            console.error("Error saving settings:", error);
            throw error;
        }
    }
}