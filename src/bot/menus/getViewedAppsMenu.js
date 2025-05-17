import {Menu} from "@grammyjs/menu"
import {getAllViewedApplications} from "../../db/application.js"
import {getRussianApplicatoinType} from "../utils/getRussianApplicatoinType.js"
import {getChatByTelegramId} from "../../db/chat.js"
import {getApplicationMessage} from "../messages/messages.js"


const getViewedApps = async (ctx, buttons) => {
    const applications = await getAllViewedApplications()
    
    if (applications.length === 0) {
        return 
    }

    for(let i = 0; i < applications.length; i++) {

        const application = applications[i]
        const type = getRussianApplicatoinType(application.type)
        const date = new Date(application.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })

        const chat = await getChatByTelegramId(application.chat_id)


        buttons.text(`#${application.id} ${type} ${date}`, 
            async (ctx) => {
                const {text, keyboard} = await getApplicationMessage(application.id)
                await ctx.reply(text, {parse_mode: 'HTML', reply_markup: keyboard})
            }).row()
    }

}

export const getViewedAppsMenu = new Menu('getApplications')

getViewedAppsMenu.dynamic(getViewedApps)

