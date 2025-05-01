const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Creates the email transport
 * @returns {nodemailer.Transporter} - Email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: config.email.service,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
};

/**
 * Sends an email
 * @param {Object} emailData - The email data
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - Email HTML content
 * @param {string} emailData.to - Recipient email address
 * @returns {Promise<Object>} - Email sending result
 */
const sendEmail = async (emailData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: config.email.user,
      to: emailData.to || config.email.recipient,
      subject: emailData.subject,
      html: emailData.html
    };

    console.log(`Sending email to ${mailOptions.to} with subject "${mailOptions.subject}"`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully');
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};