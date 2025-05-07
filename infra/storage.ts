import { router } from "./router";

export const usersTable = new sst.aws.Dynamo("Users", {
    fields: {
        email: "string",
        // userId: "string",
        // firstName: "string",
        // lastName: "string",
        // createdAt: "string",
        // updatedAt: "string",
        // emailIndex: "string",
    },
    primaryIndex: { 
        hashKey: "email",
    }
});

export const weddingsTable = new sst.aws.Dynamo("Weddings", {
    fields: {
        weddingId: "string",
        userId: "string",
        // title: "string",
        // date: "string",
        // location: "string",
        // story: "string",
        // coverPhotoUrl: "string",
        // additionalPhotos: "string",
        // visibility: "string",
        // customUrl: "string",
        // theme: "string",
        // primaryColor: "string",
        // createdAt: "string",
        // updatedAt: "string"
    },
    primaryIndex: { 
        hashKey: "weddingId",
        rangeKey: "userId"
    }
});

export const giftRegistryTable = new sst.aws.Dynamo("GiftRegistryTable", {
    fields: {
        giftId: "string",
        weddingId: "string",
        // name: "string",
        // description: "string",
        // price: "number",
        // imageUrl: "string",
        // status: "string",
        // createdAt: "string",
        // updatedAt: "string"
    },
    primaryIndex: { 
        hashKey: "giftId",
        rangeKey: "weddingId"
    }
});

export const contributionsTable = new sst.aws.Dynamo("ContributionsTable", {
    fields: {
        contributionId: "string",
        weddingId: "string",
        // userId: "string",
        // amount: "number",
        // message: "string",
        // isAnonymous: "string",
        // createdAt: "string",
        // updatedAt: "string"
    },
    primaryIndex: { 
        hashKey: "contributionId",
        rangeKey: "weddingId"
    }
});

export const settingsTable = new sst.aws.Dynamo("SettingsTable", {
    fields: {
        userId: "string",
        email: "string",
        // name: "string",
        
        // // Wedding Page Settings
        // pageVisibility: "string",
        // customUrl: "string",
        // theme: "string",
        // primaryColor: "string",
        
        // // Payment Settings
        // paymentMethod: "string",
        // accountEmail: "string",
        // notifyOnContribution: "string",
        // autoThankYou: "string",
        
        // // Notification Settings
        // emailNotifications: "string",
        // contributionAlerts: "string",
        // weeklyDigest: "string",
        // marketingEmails: "string",
        
        // // Privacy Settings
        // showContributorNames: "string",
        // showContributionAmounts: "string",
        // allowGuestComments: "string",
        // showRegistry: "string",
        
        // createdAt: "string",
        // updatedAt: "string"
    },
    primaryIndex: { 
        hashKey: "userId",
        rangeKey: "email"
    }
});


// Create S3 bucket for storing wedding assets
export const weddingAssets = new sst.aws.Bucket("WeddingAssets", {
    access: "cloudfront"
});

router.routeBucket("/files", weddingAssets, {
  rewrite: {
    regex: "^/files/(.*)$",
    to: "/$1",
  },
});