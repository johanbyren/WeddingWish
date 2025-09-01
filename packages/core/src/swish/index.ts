import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst/resource";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: "eu-north-1" });
const ddb = DynamoDBDocumentClient.from(client);

export interface SwishDonation {
  donationId?: string;
  weddingId: string;
  giftId: string;
  amount: number;
  donorName?: string;
  message?: string;
  phone?: string;
  createdAt?: string;
}

export namespace SwishDonations {
  export const save = async (donation: SwishDonation) => {
    const now = new Date().toISOString();
    const item = {
      ...donation,
      donationId: donation.donationId || uuidv4(),
      createdAt: now,
    };
    const command = new PutCommand({
      TableName: Resource.SwishDonationsTable.name,
      Item: item,
    });
    await ddb.send(command);
    return item;
  };
} 