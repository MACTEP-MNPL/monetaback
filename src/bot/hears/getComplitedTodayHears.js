import {Composer} from "grammy"
import {isOwner} from "../utils/isOwner.js"
import {getComplitedTodayMenu} from "../menus/getComplitedTodayMenu.js"

export const getComplitedTodayHears = new Composer()


getComplitedTodayHears.hears('✅ Выполненные сегодня', async (ctx) => {
    if(!(await isOwner(ctx))) {
        return
    }

    await ctx.reply('✅ Выполненные сегодня', {reply_markup: getComplitedTodayMenu})
})

