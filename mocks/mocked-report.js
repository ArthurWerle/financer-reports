const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const emailService = require('../services/email.service');
const config = require('../config/config');

handlebars.registerHelper('eq', function(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

/**
 * Generates the financial report and sends it via email
 */
const generateAndSendMockedReport = async () => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthName = format(lastMonth, 'MMMM yyyy');

    console.log(`Generating mocked report for ${monthName}`);
    
    const reportData = {
      month: monthName,
      title: config.report.title,
      spending: {
        total: 10000,
        categories: [
          { name: 'Food', amount: 2500 },
          { name: 'Grocery', amount: 1500 },
          { name: 'Housing', amount: 4000 },
          { name: 'Transportation', amount: 1000 },
          { name: 'Entertainment', amount: 1000 }
        ]
      },
      income: {
        total: 20000
      },
      savings: {
        rate: 50,
        amount: 10000
      },
      balances: 0,
    };

    const template = await fs.readFile(path.join(__dirname, '../templates/monthlyReport.handlebars'), 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    const htmlReport = compiledTemplate(reportData);

    handlebars.registerHelper('now', function() {
      return format(new Date(), 'MMMM dd, yyyy');
    });

    console.log({
      config
    })

    await emailService.sendEmail({
      subject: `${config.report.title} - ${monthName}`,
      html: htmlReport,
      to: config.email.recipient
    });

    console.log(`Mocked report for ${monthName} sent successfully`);
    return { success: true, month: monthName };
  } catch (error) {
    console.error('Error generating mocked report:', error);
    throw error;
  }
};

module.exports = {
  generateAndSendMockedReport
};