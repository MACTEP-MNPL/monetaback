import {Composer} from "grammy"
import {getAllApplicationsMenu} from "../menus/getAllApplicationsMenu.js"
import {isOwner} from "../utils/isOwner.js"

export const allApplicationsHears = new Composer()


allApplicationsHears.hears('🔄 Все заявки', async (ctx) => {
    if(!(await isOwner(ctx))) {
        return
    }

    await ctx.reply('🔄 Все заявки', {reply_markup: getAllApplicationsMenu})
})
