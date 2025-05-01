const express = require('express');
const dotenv = require('dotenv');
const { setupScheduler } = require('./services/scheduler.service');
const { generateAndSendReport } = require('./services/report-generator.service');
const { generateAndSendMockedReport } = require('./mocks/mocked-report');

dotenv.config({
    path: './stack.env'
});

const app = express();
const PORT = process.env.PORT || 3000;

setupScheduler();

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.get('/test-report/mocked-data', async (req, res) => {
    try {
      await generateAndSendMockedReport();
      res.send('Test mocked report generated and sent!');
    } catch (error) {
      console.error('Error generating mocked report:', error);
      res.status(500).send(`Error generating mocked report: ${error.message}`);
    }
  });

app.get('/test-report', async (req, res) => {
  try {
    await generateAndSendReport();
    res.send('Test report generated and sent!');
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send(`Error generating report: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Financial Report Service running on port ${PORT}`);
  console.log(`Scheduler configured to run at: ${process.env.CRON_SCHEDULE}`);
});