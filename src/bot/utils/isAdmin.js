import {getUserByTelegramId} from "../../db/application.js"

export const isAdmin = async (ctx) => {
    const user = await getUserByTelegramId(ctx.from.id)

    return user.role === 'owner' || user.role === 'manager'
}