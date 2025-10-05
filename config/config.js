const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../stack.env');
console.log(`Loading environment variables from: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded successfully');
}

module.exports = {
  server: {
    port: process.env.PORT || 3000
  },
  scheduler: {
    cronSchedule: process.env.CRON_SCHEDULE || "0 8 1 * *"  // Default to 8am on the 1st day of every month
  },
  services: {
    transactionServiceBaseUrl: process.env.TRANSACTION_SERVICE_BASE_URL
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    recipient: process.env.EMAIL_RECIPIENT
  },
  report: {
    title: process.env.REPORT_TITLE || 'Monthly Financial Report'
  }
};