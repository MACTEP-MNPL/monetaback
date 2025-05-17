import {Composer} from "grammy"

export const findApplicationByIdHears = new Composer()

findApplicationByIdHears.hears('🔍 Найти заявку по ID', async (ctx) => {
    await ctx.conversation.enter('getApplicationByIdConversation')
})


