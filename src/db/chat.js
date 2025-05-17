import {db} from "../index.js"

export const getChatByTelegramId = async (chatId) => {
    const [rows] = await db.execute(
        'SELECT * FROM chats WHERE chat_id = ?',
        [chatId]    
    )
    return rows[0] || null
}

export const getChatByApplicationId = async (applicationId) => {
    const [rows] = await db.execute(
        'SELECT * FROM chats WHERE application_id = ?',
        [applicationId]
    )
    return rows[0] || null
}
