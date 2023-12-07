import AWS from "aws-sdk";
import { settings } from "../config/settings.js";

export class AwsUploadService {
  static async uploadFileWithContent(
    fileName: string,
    fileContent: string | any
  ) {
    AWS.config.update({
      accessKeyId: settings.awsBucketCredentials.accessKeyId,
      secretAccessKey: settings.awsBucketCredentials.secretAccessKey,
    });

    const bucketName = settings.awsBucketCredentials.bucketName;
    const params = {
      Bucket: `${bucketName}/${fileName}`,
      Key: fileName,
      Body: fileContent,
      contentType: "text/plain",
    };

    const s3 = new AWS.S3();
    return new Promise<string>((resolve, reject) => {
      s3.upload(params, (err: unknown, data: any) => {
        if (err) reject(err);
        resolve(data.Location);
      });
    });
  }
}
