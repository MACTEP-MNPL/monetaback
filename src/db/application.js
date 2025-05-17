import { db } from '../index.js';
import { connectChatWithApplication } from '../server/chat.js';
import { bot } from '../bot/bot.js';


export const createApplicationWithExistingChat = async (type, chatId) => {
    const [result] = await db.execute(
        'INSERT INTO applications (type, status, chat_id) VALUES (?, ?, ?)',
        [type, 'new', chatId]
    )

    await db.execute('UPDATE chats SET application_id = ? WHERE chat_id = ?', [result.insertId, chatId])

    const paddedId = String(result.insertId).padStart(6, '0')
    const chatTitle = `🔥 monetazone | ${paddedId}`
    await bot.api.setChatTitle(chatId, chatTitle)

    await db.execute('INSERT INTO application_timestamps (application_id) VALUES (?)', [result.insertId])

    return result.insertId
}

export const createApplicationWithExistingChatAndManualManager = async (type, chatId, managerId) => {
    const [result] = await db.execute(
        'INSERT INTO applications (type, status, chat_id, manager_id) VALUES (?, ?, ?, ?)',
        [type, 'new', chatId, managerId]
    )

    await db.execute('INSERT INTO application_timestamps (application_id) VALUES (?)', [result.insertId])

    return result.insertId
}

export const createApplication = async (type) => {
    const [result] = await db.execute(
        'INSERT INTO applications (type, status) VALUES (?, ?)',
        [type, 'new']
    )

    await db.execute('INSERT INTO application_timestamps (application_id) VALUES (?)', [result.insertId])

    const {id, chat_id} = await connectChatWithApplication(result.insertId)

    const paddedId = String(result.insertId).padStart(6, '0')
    const chatTitle = `🟢 monetazone | ${paddedId}`
    await bot.api.setChatTitle(chat_id, chatTitle)

    return result.insertId
}

export const getApplicationById = async (applicationId) => {
    const [rows] = await db.execute(
        `SELECT a.*, c.invite_link 
         FROM applications a 
         JOIN chats c ON a.chat_id = c.chat_id 
         WHERE a.id = ?`,
        [applicationId]
    );
    
    return rows[0] || null;
}

export const updateApplicationStatus = async (applicationId, status) => {
    await db.execute(
        'UPDATE applications SET status = ? WHERE id = ?',
        [status, applicationId]
    )
}

export const getUserByTelegramId = async (telegramId) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [telegramId]
    )
    return rows[0] || null
}

export const getAllViewedApplications = async () => {
    
    const [rows] = await db.execute(
        'SELECT * FROM applications WHERE status = ?',
        ['viewed']
    )
    return rows
}

export const getAllInProgressApplications = async () => {
    const [rows] = await db.execute(
        'SELECT * FROM applications WHERE status = ?',
        ['in_progress']
    )
    return rows
}

export const getAllComplitedTodayApplications = async () => {

    const [ids] = await db.execute(
        'SELECT application_id FROM application_timestamps WHERE completed_at >= ?',
        [new Date(new Date().setDate(new Date().getDate() - 1))]
    )

    const [rows] = await db.execute(
        `SELECT * FROM applications WHERE status = ? AND id IN (${ids.map(() => '?').join(',')})`,
        ['completed', ...ids.map(id => id.application_id)]
    )


    return rows
}

export const getManagerInProgressApplications = async (managerId) => {
    const [rows] = await db.execute(
        'SELECT * FROM applications WHERE status = ? AND manager_tg_id = ?',
        ['in_progress', managerId]
    )
    return rows
}
