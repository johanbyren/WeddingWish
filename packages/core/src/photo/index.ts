import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resource } from "sst";

const s3 = new S3Client({
    region: "eu-north-1",
});

export namespace Photo {
    /**
     * Get a photo by fileName (key)
     */
    export const getByFileName = async (fileName: string): Promise<{ url: string }> => {
        console.log("Detta är key: ", fileName);
        console.log("Detta är bucket: ", Resource.WeddingAssets.name);
        try {
            const command = new GetObjectCommand({
                Bucket: Resource.WeddingAssets.name,
                Key: fileName,
                ResponseContentDisposition: "inline",
            });

            // Generate a signed URL that expires in 1 hour
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return { url };
        } catch (error) {
            console.error("Error fetching photo:", error);
            throw error;
        }
    };

    /**
     * Generate a signed URL for photo upload
     */
    export const generateUploadUrl = async (weddingId: string, fileName: string, contentType: string) => {
        try {
            const key = `weddings/${weddingId}/${fileName}`;
            
            const command = new PutObjectCommand({
                Bucket: Resource.WeddingAssets.name,
                Key: key,
                ContentType: contentType,
            });

            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            
            return { 
                signedUrl,
                key 
            };
        } catch (error) {
            console.error("Error generating upload URL:", error);
            throw error;
        }
    };
}
