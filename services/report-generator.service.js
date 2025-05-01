const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const financialApiService = require('./api.service');
const emailService = require('./email.service');
const config = require('../config/config');

handlebars.registerHelper('eq', function(arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

/**
 * Generates the financial report and sends it via email
 */
const generateAndSendReport = async () => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthFormatted = format(lastMonth, 'yyyy-MM');
    const monthName = format(lastMonth, 'MMMM yyyy');

    console.log(`Generating report for ${monthName}`);

    const [spending, balances, topCategories] = await Promise.all([
      financialApiService.getMonthlySpending(monthFormatted),
      financialApiService.getAccountBalances(),
      financialApiService.getTopSpendingCategories(monthFormatted, 5)
    ]);

    const totalSpent = spending.totalAmount || 0;
    const totalIncome = spending.totalIncome || 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome * 100).toFixed(1) : 0;
    
    const reportData = {
      month: monthName,
      title: config.report.title,
      spending: {
        total: totalSpent,
        categories: topCategories
      },
      income: {
        total: totalIncome
      },
      savings: {
        rate: savingsRate,
        amount: (totalIncome - totalSpent).toFixed(2)
      },
      balances,
    };

    handlebars.registerHelper('now', function() {
      return format(new Date(), 'MMMM dd, yyyy');
    });

    const template = await fs.readFile(path.join(__dirname, '../templates/monthlyReport.handlebars'), 'utf-8');
    const compiledTemplate = handlebars.compile(template);
    const htmlReport = compiledTemplate(reportData);

    await emailService.sendEmail({
      subject: `${config.report.title} - ${monthName}`,
      html: htmlReport,
      to: config.email.recipient
    });

    console.log(`Report for ${monthName} sent successfully`);
    return { success: true, month: monthName };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

module.exports = {
  generateAndSendReport
};