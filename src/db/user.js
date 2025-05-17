import {db} from "../index.js"

export const getUsernameByTelegramId = async (telegramId) => {
    const [user] = await db.execute(
        'SELECT username FROM users WHERE id = ?',
        [telegramId]
    )
    if (user.length === 0) {
        return `${telegramId}`
    }
    return user[0].username
}


