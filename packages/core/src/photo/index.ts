import { GetObjectCommand, PutObjectCommand, S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
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

    /**
     * List all photos for a wedding
     */
    export const listPhotosByWeddingId = async (weddingId: string) => {
        try {
            const command = new ListObjectsV2Command({
                Bucket: Resource.WeddingAssets.name,
                Prefix: `weddings/${weddingId}/`,
            });

            const response = await s3.send(command);
            const photos = await Promise.all(
                (response.Contents || []).map(async (item) => {
                    if (!item.Key) return null;
                    const { url } = await Photo.getByFileName(item.Key);
                    return {
                        key: item.Key,
                        url,
                    };
                })
            );

            return photos.filter((photo): photo is { key: string; url: string } => photo !== null);
        } catch (error) {
            console.error("Error listing photos:", error);
            throw error;
        }
    };

    /**
     * Generate a signed URL for gift photo upload
     */
    export const generateGiftPhotoUploadUrl = async (giftId: string, fileName: string, contentType: string) => {
        try {
            const key = `gifts/${giftId}/${fileName}`;
            
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
            console.error("Error generating gift photo upload URL:", error);
            throw error;
        }
    };

    /**
     * Get a gift photo by fileName (key)
     */
    export const getGiftPhotoByFileName = async (fileName: string): Promise<{ url: string }> => {
        try {
            const command = new GetObjectCommand({
                Bucket: Resource.WeddingAssets.name,
                Key: fileName,
                ResponseContentDisposition: "inline",
            });

            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return { url };
        } catch (error) {
            console.error("Error fetching gift photo:", error);
            throw error;
        }
    };
}
