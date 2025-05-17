import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createApplication } from '../db/application.js';
import {createFeaTypeApplication} from './createFeaTypeApplication.js'
import {createSwiftTypeApplication} from './createSwiftTypeApplication.js'
import {createCashTypeApplication} from './createCashTypeApplication.js'
import { db } from '../index.js';

dotenv.config();

export const app = express()

const corsOptions = {
    origin: ['http://localhost:80', 'https://localhost:443', 'http://localhost:5173'],
    //origin: ['https://monetazone.com'],
    methods: ['POST', 'GET'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

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
