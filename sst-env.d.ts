/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "Api": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "AuthApi": {
      "type": "sst.aws.Auth"
      "url": string
    }
    "ContributionsTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Email": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
    "GiftRegistryTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "React": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "STRIPE_ACCOUNT_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "STRIPE_PUBLISHABLE_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "STRIPE_SECRET_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SettingsTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Users": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "WeddingAssets": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "WeddingAssetsRouter": {
      "type": "sst.aws.Router"
      "url": string
    }
    "Weddings": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}