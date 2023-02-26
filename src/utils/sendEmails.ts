import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    const user = process.env.SMTP_USERNAME;
    const password = process.env.SMTP_PASSWORD;

    const transporter = nodemailer.createTransport({
      // host: "smtp.example.com",
      // port: 465,
      // secure: true,
      service: "gmail",
      auth: {
        user: user,
        pass: password,
      },
    });

    const mailOptions = {
      from: '"Anatha-Web-App@Beta" <noreply@myapp.com>',
      to: email,
      subject: "Confirm Your Registration",
      text: `Your one-time password for registration is: ${otp}`,
      html: `<p>Your one-time password for registration is:</p><p style="font-size: 24px; font-weight: bold;">${otp}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};
