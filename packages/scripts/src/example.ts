import { Resource } from "sst";
import { Example } from "@wedding-wish/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
