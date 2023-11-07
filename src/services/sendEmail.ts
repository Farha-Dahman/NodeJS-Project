import nodemailer from 'nodemailer';

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

  await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;
