import { Composer } from "grammy";
import { isAdmin } from "../utils/isAdmin.js";
import { getMyAppsMenu } from "../menus/getMyApplicationsMenu.js";


export const getMyApplicationsHears = new Composer()

getMyApplicationsHears.hears('🎯 Мои заявки', async (ctx) => {
    if(!(await isAdmin(ctx))) {
        return
    }

    await ctx.reply('🎯 <b>Мои заявки</b>', {
        parse_mode: 'HTML',
        reply_markup: getMyAppsMenu
    })

})