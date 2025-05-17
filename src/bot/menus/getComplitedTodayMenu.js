import {Menu} from "@grammyjs/menu"
import {getAllComplitedTodayApplications} from "../../db/application.js"
import {getRussianApplicatoinType} from "../utils/getRussianApplicatoinType.js"
import {getChatByTelegramId} from "../../db/chat.js"
import {getApplicationMessage} from "../messages/messages.js"



const getComplitedToday = async (ctx, buttons) => {
    const applications = await getAllComplitedTodayApplications()
    console.log(applications)

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


        console.log(chat)

        buttons.text(`#${application.id} ${type} ${date}`, 
            async (ctx) => {
                const {text, keyboard} = await getApplicationMessage(application.id)
                await ctx.reply(text, {parse_mode: 'HTML', reply_markup: keyboard})
            }).row()
    }
}


export const getComplitedTodayMenu = new Menu('getComplitedToday')

getComplitedTodayMenu.dynamic(getComplitedToday)

