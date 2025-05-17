import {getInProgressAppsMenu} from "../menus/getInProgressAppsMenu.js"
import {isOwner} from "../utils/isOwner.js"
import {Composer} from "grammy"


export const getAppsInProgressHears = new Composer()

getAppsInProgressHears.hears('🔄 Заявки в работе', async (ctx) => {
    if(!(await isOwner(ctx))) {
        return
    }

    await ctx.reply('🔄 Заявки в работе', {reply_markup: getInProgressAppsMenu})
})



