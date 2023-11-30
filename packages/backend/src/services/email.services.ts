import AWS from 'aws-sdk';
import { settings } from '../config/settings.js';

export class EmailService {
  static async sendEmail(
    toEmail: string,
    subjectMessage: string,
    bodyMessage: string,
  ) {
    AWS.config.update({
      region: settings.emailCredentials.region,
      accessKeyId: settings.emailCredentials.accessKeyId,
      secretAccessKey: settings.emailCredentials.secretAccessKey
    });
    const ses = new AWS.SES();
    const params = {
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Text: {
            Data: bodyMessage,
          },
        },
        Subject: {
          Data: subjectMessage,
        },
      },
      Source: 'yashmadlani710@gmail.com',
    };
    try {
      const result = await ses.sendEmail(params).promise();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};