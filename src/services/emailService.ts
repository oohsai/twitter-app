import { SES, SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
require("dotenv").config();

const ses = new SESClient({});

function createSendEmailCommand(
  toAddress: string,
  fromAddress: string,
  message: string
) {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Source: fromAddress,
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your OTP",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
}

export async function sendEmailToken(email: string, token: string) {
  const message = "Your OTP is";
  const command = createSendEmailCommand(email, "s72454726@gmail.com", message);
  try {
    return await ses.send(command);
  } catch (error) {
    console.log("Error in Sending the mail");
    return error;
  }
}
