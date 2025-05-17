import { db } from '../index.js';

export const createFeaTypeApplication = async (req, applicationId) => {

    const {
        name,
        date,
        office,
        details
    } = req.body;

    const {
        typeOfService,
        paymentAssignment,
        fundsJurisdiction,
        intakeMoneyJurisdiction,
        amount,
        paymentMethod
    } = details;

    const ip = req.ip || req.connection.remoteAddress;

    const [response] = await db.execute(
        `INSERT INTO fea_applications (
            id,
            name, 
            date, 
            office, 
            type_of_service, 
            payment_assignment, 
            funds_jurisdiction, 
            intake_money_jurisdiction, 
            amount,
            payment_method,
            ip
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            applicationId,
            name,
            date,
            office,
            typeOfService,
            paymentAssignment,
            fundsJurisdiction,
            intakeMoneyJurisdiction,
            amount,
            paymentMethod,
            ip
        ]
    );
};