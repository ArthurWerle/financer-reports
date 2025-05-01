const cron = require('node-cron');
const config = require('../config/config');
const { generateAndSendReport } = require('./report-generator.service');

/**
 * Sets up the cron job to generate and send reports
 */
const setupScheduler = () => {
  if (!cron.validate(config.scheduler.cronSchedule)) {
    console.error('Invalid CRON schedule:', config.scheduler.cronSchedule);
    process.exit(1);
  }

  console.log(`Setting up scheduler with CRON: ${config.scheduler.cronSchedule}`);
  
  cron.schedule(config.scheduler.cronSchedule, async () => {
    console.log('Running scheduled task: Generating monthly financial report');
    try {
      await generateAndSendReport();
      console.log('Monthly report generated and sent successfully');
    } catch (error) {
      console.error('Error in scheduled report generation:', error);
    }
  });
};

module.exports = {
  setupScheduler
};