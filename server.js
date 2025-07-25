const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'BH5QY6K3JQKBEMT7';

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Cache to avoid hitting API limits
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached data
function getCachedData(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

// Helper function to set cache
function setCacheData(key, data) {
    cache.set(key, {
        data: data,
        timestamp: Date.now()
    });
}

// API Routes
app.get('/api/quote/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `quote_${symbol}`;
        
        let data = getCachedData(cacheKey);
        if (data) {
            return res.json(data);
        }

        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        data = response.data;
        setCacheData(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/overview/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `overview_${symbol}`;
        
        let data = getCachedData(cacheKey);
        if (data) {
            return res.json(data);
        }

        const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`);
        data = response.data;
        setCacheData(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/income/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `income_${symbol}`;
        
        let data = getCachedData(cacheKey);
        if (data) {
            return res.json(data);
        }

        const response = await axios.get(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`);
        data = response.data;
        setCacheData(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/balance/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `balance_${symbol}`;
        
        let data = getCachedData(cacheKey);
        if (data) {
            return res.json(data);
        }

        const response = await axios.get(`https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`);
        data = response.data;
        setCacheData(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/cashflow/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const cacheKey = `cashflow_${symbol}`;
        
        let data = getCachedData(cacheKey);
        if (data) {
            return res.json(data);
        }

        const response = await axios.get(`https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`);
        data = response.data;
        setCacheData(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/timeseries/:symbol/:interval', async (req, res) => {
    try {
        const { symbol, interval } = req.params;
        const cacheKey = `timeseries_${symbol}_${interval}`;
        
        let data = getCachedData(cacheKey);
        if (data) {
            return res.json(data);
        }

        let func = 'TIME_SERIES_DAILY';
        if (interval === 'weekly') func = 'TIME_SERIES_WEEKLY';
        if (interval === 'monthly') func = 'TIME_SERIES_MONTHLY';

        const response = await axios.get(`https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`);
        data = response.data;
        setCacheData(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
