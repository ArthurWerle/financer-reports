const axios = require('axios');
const config = require('../config/config');

/**
 * API client for the financial service
 */
const apiClient = axios.create({
  baseURL: config.financialApi.transactionServiceBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get monthly spending summary
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Object>} - Monthly spending data
 */
const getMonthlySpending = async (month) => {
  try {
    const response = await apiClient.get(`/spending/monthly/${month}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly spending:', error.message);
    throw new Error(`Failed to fetch monthly spending: ${error.message}`);
  }
};

/**
 * Get account balances
 * @returns {Promise<Object>} - Account balances
 */
const getAccountBalances = async () => {
  try {
    const response = await apiClient.get('/accounts/balances');
    return response.data;
  } catch (error) {
    console.error('Error fetching account balances:', error.message);
    throw new Error(`Failed to fetch account balances: ${error.message}`);
  }
};

/**
 * Get budget status
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Object>} - Budget status
 */
const getBudgetStatus = async (month) => {
  try {
    const response = await apiClient.get(`/budget/status/${month}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching budget status:', error.message);
    throw new Error(`Failed to fetch budget status: ${error.message}`);
  }
};

/**
 * Get top spending categories
 * @param {string} month - Month in YYYY-MM format
 * @param {number} limit - Number of categories to return
 * @returns {Promise<Array>} - Top spending categories
 */
const getTopSpendingCategories = async (month, limit = 5) => {
  try {
    const response = await apiClient.get(`/spending/categories/${month}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top spending categories:', error.message);
    throw new Error(`Failed to fetch top spending categories: ${error.message}`);
  }
};

module.exports = {
  getMonthlySpending,
  getAccountBalances,
  getBudgetStatus,
  getTopSpendingCategories
};