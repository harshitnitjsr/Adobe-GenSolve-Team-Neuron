import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "08390e1f13ef76", //
        pass: "9e65a5b5fae437", //
      },
    });
    const mailOptions = {
      from: "harshit26092004@harshit.ai",
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset Your Password", // Subject line
      text: "Hello world?", // plain text body
      html: `<p> Click <a href="${
        process.env.DOMAIN
      }/api/users/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset email"
      }  or copy paste the link in your browser.
       <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>
      `, // html body
    };
    const mailResponse = await transport.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
