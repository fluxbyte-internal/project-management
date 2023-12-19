import AWS from "aws-sdk";
import { settings } from "../config/settings.js";

export class AwsUploadService {
  static async uploadFileWithContent(
    fileName: string,
    fileContent: string | any,
    fileType: string
  ) {
    AWS.config.update({
      accessKeyId: settings.awsBucketCredentials.accessKeyId,
      secretAccessKey: settings.awsBucketCredentials.secretAccessKey,
    });

    const bucketName = settings.awsBucketCredentials.bucketName;
    const params = {
      Bucket: `${bucketName}/${settings.environment}/${fileType}`,
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

  // TODO: If Delete require on S3
  // static async deleteFile(fileName: string, fileType: string) {
  //   AWS.config.update({
  //     accessKeyId: settings.awsBucketCredentials.accessKeyId,
  //     secretAccessKey: settings.awsBucketCredentials.secretAccessKey,
  //   });

  //   const bucketName = settings.awsBucketCredentials.bucketName;
  //   const params = {
  //     Bucket: `${bucketName}/${settings.environment}/${fileType}`,
  //     Key: fileName,
  //   };

  //   const s3 = new AWS.S3();
  //   return new Promise<void>((resolve, reject) => {
  //     s3.deleteObject(params, (err: unknown) => {
  //       if (err) reject(err);
  //       resolve();
  //     });
  //   });
  // };
}
