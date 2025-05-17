import {getUserByTelegramId} from "../../db/application.js"

export const isOwner = async (ctx) => {
    const user = await getUserByTelegramId(ctx.from.id)
    return user.role === 'owner'
}

