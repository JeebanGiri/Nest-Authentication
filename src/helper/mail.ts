import { createTransport, SendMailOptions } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'solverspro@gmail.com',
    pass: 'gfvodsgteyhzcloc',
  },
});

const sendMail = async (options: SendMailOptions) => {
  try {
    options.from = 'solverspro@gmail.com';
    const result = await transporter.sendMail(options);
    console.log('SEND MAIL RESULT START', result);
  } catch (err) {
    console.log('SEND MAIL ERROR:', err);
    throw err; // Rethrow the error to handle it in the calling function.
  }
};

export { sendMail };
