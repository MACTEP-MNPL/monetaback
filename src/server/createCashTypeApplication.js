import { db } from '../index.js';

export const createCashTypeApplication = async (req, applicationId) => {
    const {
        name,
        date,
        office,
        type,
        details
    } = req.body;

    const ip = req.ip || req.connection.remoteAddress;

    if (type === 'cash_exchange') {

        const {
            giveAmount,
            giveAmountCurrency,
            getAmount,
            getAmountCurrency,
            rate
        } = details;

        const [response] = await db.execute(
            `INSERT INTO cash_exchange_applications (
                id,
                name,
                date,
                office,
                give_amount,
                give_amount_currency,
                get_amount,
                get_amount_currency,
                exchange_rate,
                ip
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                applicationId,
                name,
                date,
                office,
                giveAmount,
                giveAmountCurrency,
                getAmount,
                getAmountCurrency,
                rate,
                ip
            ]
        );

    } else if (type === 'cash_withdrawal') {

        const {
            amount,
            country,
            currency,
            city,
            cashCurrency
        } = details;

        const [response] = await db.execute(
            `INSERT INTO cash_withdrawal_applications (
                id,
                name,
                date,
                office,
                country,
                currency,
                city,
                cash_currency,
                ip,
                amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                applicationId,
                name,
                date,
                office,
                country,
                currency,
                city,
                cashCurrency,
                ip,
                amount
            ]
        );


    }
};