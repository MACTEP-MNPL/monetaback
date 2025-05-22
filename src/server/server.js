import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createApplication } from '../db/application.js';
import {createFeaTypeApplication} from './createFeaTypeApplication.js'
import {createSwiftTypeApplication} from './createSwiftTypeApplication.js'
import {createCashTypeApplication} from './createCashTypeApplication.js'
import { db } from '../index.js';
import { createApi } from '../api/createApi.js';

dotenv.config();

export const app = express()

// Initialize API
const api = new createApi();


// Constants for pricing
const COST_PRICE_COMMISSION = 0.25; // 25 копеек комиссия
const MARGIN_TIER_50K_PLUS = 1.5;   // +1.5 рубля для 50k+
const MARGIN_TIER_20K_50K = 2.0;    // +2 рубля для 20-50k

const corsOptions = {
    origin: ['http://localhost:80', 'https://localhost:443', 'http://localhost:5173', 'http://localhost:3000'],
    //origin: ['https://monetazone.com', 'https://brodskiyexchange.com'],
    methods: ['POST', 'GET'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

// New endpoint for Grinex rates
app.get('/rates/grinex', async (req, res) => {
    try {
        // Import functions directly to ensure they're available
        const { GrinexBuyUsdt, GrinexSellUsdt } = api
        
        const buyRate = Number(GrinexBuyUsdt).toFixed(2);
        const sellRate = Number(GrinexSellUsdt).toFixed(2);

        
        res.status(200).json({
            success: true,
            data: {
                buy: Number(buyRate),
                sell: Number(sellRate)
            }
        });
    } catch (error) {
        console.error('Error fetching Grinex rates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Grinex rates'
        });
    }
});

app.get('/exchange-rate', async (req, res) => {
    try {
        const { from, to } = req.query;

        // Validate currencies
        if (!from || !to) {
            return res.status(400).json({
                success: false,
                message: 'Both "from" and "to" currencies are required'
            });
        }

        // Check if we're dealing with supported currencies
        if (!['USDT', 'RUB'].includes(from) || !['USDT', 'RUB'].includes(to) || from === to) {
            return res.status(400).json({
                success: false,
                message: 'Invalid currency pair'
            });
        }

        // Get margin from database
        const [marginRows] = await db.execute(
            'SELECT value FROM settings WHERE `key` = ?',
            ['margin']
        );
        const marginPercent = parseFloat(marginRows[0]?.value ?? 0);

        // Get current Rapira rates
        const rapiraRates = api.getRates();
        let baseRate, costPrice, tier_50k_plus, tier_10k_50k;

        if (from === 'USDT' && to === 'RUB') {
            // Selling USDT for RUB (client sells USDT, we buy)
            baseRate = rapiraRates.sell; // Use Rapira's bid price
            costPrice = baseRate - COST_PRICE_COMMISSION;
            const marginAmount = (baseRate * marginPercent) / 100;
            tier_50k_plus = costPrice - MARGIN_TIER_50K_PLUS - marginAmount;
            tier_10k_50k = costPrice - MARGIN_TIER_20K_50K - marginAmount;
        } else {
            // Buying USDT with RUB (client buys USDT, we sell)
            baseRate = rapiraRates.buy; // Use Rapira's ask price
            costPrice = baseRate + COST_PRICE_COMMISSION;
            const marginAmount = (baseRate * marginPercent) / 100;
            tier_50k_plus = costPrice + MARGIN_TIER_50K_PLUS + marginAmount;
            tier_10k_50k = costPrice + MARGIN_TIER_20K_50K + marginAmount;
        }

        res.status(200).json({
            success: true,
            data: {
                from,
                to,
                rates: {
                    base_rate: baseRate,
                    cost_price: costPrice,
                    tier_10k_50k: tier_10k_50k,
                    tier_50k_plus: tier_50k_plus
                },
                timestamp: rapiraRates.timestamp
            }
        });
    } catch (error) {
        console.error('Error in exchange rate endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.post('/new', async (req, res) => {
    try {
        const data = req.body;

        const applicationId = await createApplication(data.type)
        
        switch(data.type) {
            case 'fea':
                await createFeaTypeApplication(req, applicationId);
                break;
            case 'swift':
                await createSwiftTypeApplication(req, applicationId);
                break;
            case 'cash_exchange':
            case 'cash_withdrawal':
                await createCashTypeApplication(req, applicationId);
                break;
            default:
                throw new Error('Invalid application type');
        }

        // Get chat_id and invite_link for the application
        const [rows] = await db.execute(
            'SELECT c.invite_link FROM applications a JOIN chats c ON a.chat_id = c.chat_id WHERE a.id = ?',
            [applicationId]
        );

        if (!rows || rows.length === 0) {
            throw new Error('Chat not found for application');
        }
        
        res.status(200).json({ 
            success: true,
            chatLink: rows[0].invite_link || null
        });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
})

app.get('/margin', async (req, res) => {
    const [rows] = await db.execute(
        'SELECT `value` FROM settings WHERE `key` = ?',
        ['margin']
    )

    res.status(200).json({ margin: rows[0]?.value ?? 0 })
})
