# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Financer Reports is a Node.js service that automatically generates and emails monthly financial reports. It:
- Runs as a scheduled cron job to generate reports on the 1st of each month
- Fetches financial data from an external transaction service API
- Generates HTML reports using Handlebars templates
- Sends reports via email using Nodemailer

## Architecture

The application follows a service-oriented architecture with clear separation of concerns:

**Core Services:**
- `services/scheduler.service.js` - Sets up the cron job that triggers monthly report generation
- `services/report-generator.service.js` - Orchestrates the report generation flow: fetches data from API, compiles Handlebars template, and sends email
- `services/api.service.js` - Axios client for fetching financial data from the transaction service API
- `services/email.service.js` - Nodemailer wrapper for sending emails

**Flow:**
1. Scheduler triggers `generateAndSendReport()` on cron schedule
2. Report generator fetches spending, balances, and top categories in parallel using `Promise.all()`
3. Data is merged with Handlebars template from `templates/monthlyReport.handlebars`
4. HTML report is emailed to configured recipient

**Configuration:**
- All config loaded from `stack.env` file via `config/config.js`
- Config handles: Financial API URL, email credentials, cron schedule, report title

## Development Commands

**Run the service:**
```bash
npm start              # Production mode
npm run dev            # Development mode with nodemon
```

**Docker:**
```bash
docker-compose up -d   # Start service in Docker
```
The service runs on port 8085 in Docker (configured in docker-compose.yml) and connects to the `financer-services_back-end` network.

**Test endpoints:**
```bash
# Health check
curl http://localhost:3000/health

# Trigger test report with real API data
curl http://localhost:3000/test-report

# Trigger test report with mocked data
curl http://localhost:3000/test-report/mocked-data
```

## Environment Configuration

The service requires `stack.env` file with:
- `TRANSACTION_SERVICE_BASE_URL` - Base URL for the financial transaction API
- `EMAIL_SERVICE` - Email service provider (e.g., Gmail)
- `EMAIL_USER` - Email account username
- `EMAIL_PASSWORD` - Email account password/app password
- `EMAIL_RECIPIENT` - Report recipient email
- `CRON_SCHEDULE` - Cron expression (default: "0 8 1 * *" = 8am on 1st of month)
- `PORT` - Server port (default: 3000)
- `REPORT_TITLE` - Custom report title (default: "Monthly Financial Report")

Note: There's a config bug where `api.service.js:8` references `config.financialApi.transactionServiceBaseUrl` but the config exports it as `config.services.transactionServiceBaseUrl` (config/config.js:23).

## API Dependencies

The service expects these endpoints from the transaction service:
- `GET /spending/monthly/:month` - Returns `{ totalAmount, totalIncome }`
- `GET /accounts/balances` - Returns account balance data
- `GET /spending/categories/:month?limit=N` - Returns top N spending categories

## Key Implementation Details

- Date handling uses `date-fns` for formatting (YYYY-MM format for API calls, display names for reports)
- Report calculates savings rate as: `(income - spending) / income * 100`
- Handlebars custom helper `eq` for equality checks in templates
- Handlebars custom helper `now` for current date formatting
- Error handling: Services throw errors with descriptive messages that propagate up to caller
