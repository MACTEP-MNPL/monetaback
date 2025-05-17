import {Composer} from "grammy"
import {getViewedAppsMenu} from "../menus/getViewedAppsMenu.js"
import {isAdmin} from "../utils/isAdmin.js"

export const getViewedApplicationsHears = new Composer()

getViewedApplicationsHears.hears('🔥 Новые заявки', async (ctx) => {
    if(!(await isAdmin(ctx))) {
        return
    }
    await ctx.reply('🔥 <b>Новые заявки</b>', {
        parse_mode: 'HTML',
        reply_markup: getViewedAppsMenu
    })
})