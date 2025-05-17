import { db } from '../index.js';
export const createSwiftTypeApplication = async (req, applicationId) => {
    
    const {
        name,
        date,
        office,
        details
    } = req.body;

    const {
        paymentSystem,
        paymentAssignment,
        country,
        currency,
        amount,
        intakeCurrency
    } = details;

    const ip = req.ip || req.connection.remoteAddress;

    const [response] = await db.execute(
        `INSERT INTO swift_applications (
            id,
            name,
            date,
            office,
            payment_system,
            payment_assignment,
            country,
            currency,
            amount,
            intake_currency,
            ip
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            applicationId,
            name,
            date,
            office,
            paymentSystem,
            paymentAssignment,
            country,
            currency,
            amount,
            intakeCurrency,
            ip
        ]
    );
}; 