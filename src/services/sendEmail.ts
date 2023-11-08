import nodemailer from 'nodemailer';
import logger from '../../logger';

const sendConfirmationEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.SEND_PASSWORD,
    },
  });
  const mailOptions = {
    from: `Trello <${process.env.SEND_EMAIL}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to: ${to}, Subject: ${subject}`);
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error}`);
  }
};

export default sendConfirmationEmail;
