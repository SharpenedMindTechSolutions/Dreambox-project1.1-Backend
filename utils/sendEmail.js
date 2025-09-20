// import nodemailer from 'nodemailer';

// const sendEmail = async (to, subject, html) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     }
//   });
//   console.log(process.env.EMAIL_PASS + process.env.EMAIL_USER)
 
//   await transporter.sendMail({
//     from: `"Sharpened Mind Tech and Solution" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// export default sendEmail;



import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // gmail address
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const info = await transporter.sendMail({
      from: `"Sharpened Mind Tech and Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;
