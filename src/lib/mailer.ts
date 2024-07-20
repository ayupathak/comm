import nodemailer from "nodemailer";
import crypto from "crypto";
import { db } from "~/server/db";
import { env } from "~/env";

type SendEmailProps = {
  email: string;
  userId: string;
};

export const sendEmail = async ({ email, userId }: SendEmailProps) => {
  try {
    const token = crypto.randomBytes(4).toString("hex");
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        verifyToken: token,
        verifyTokenExpiry: new Date(Date.now() + 3600000),
      },
    });

    var transport = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    const mailOpts = {
      from: "ayushipa@outlook.com",
      to: email,
      bcc: process.env.EMAIL_BCC,
      subject: "Verify your email",
      html: `<!DOCTYPE html>
      <html>
      <head>
        <title>Verification Code</title>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 20px;
            text-align: center;
          }
          .email-header {
            background-color: #f2f4f6;
            padding: 10px;
            font-size: 24px;
            color: #333;
          }
          .email-body {
            margin: 20px 0;
            color: #555;
          }
          .email-code {
            font-size: 20px;
            font-weight: bold;
            color: #000;
            padding: 10px;
            border: 1px dashed #ddd;
            display: inline-block;
            margin: 20px 0;
          }
          .email-footer {
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            Email Verification
          </div>
      
          <div class="email-body">
            <p>Hello,</p>
            <p>Thank you for registering with us. Please enter the following verification code to complete your registration:</p>
            <div class="email-code">${token}</div>
            <p>If you did not request this code, please ignore this email.</p>
          </div>
      
          <div class="email-footer">
            <p>Best regards,</p>
            <p>Ecommerce</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    const mailresponse = await transport.sendMail(mailOpts);
    return mailresponse;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
