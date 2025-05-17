import { Menu } from "@grammyjs/menu"
import { getRussianApplicatoinType } from "../utils/getRussianApplicatoinType.js"
import { getManagerInProgressApplications } from "../../db/application.js"
import { getApplicationMessage } from "../messages/messages.js"

const getMyInProgressApps = async (ctx, buttons) => {
    const applications = await getManagerInProgressApplications(ctx.from.id)

    if (applications.length === 0) {
        await ctx.reply("У вас нет заявок в работе.")
        return
    }

    for (const application of applications) {
        const type = getRussianApplicatoinType(application.type)
        const date = new Date(application.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })

        buttons.text(
            `#${application.id} ${type} ${date}`,
            async (ctx) => {
                const { text, keyboard } = await getApplicationMessage(application.id)
                await ctx.reply(text, {
                    parse_mode: 'HTML',
                    reply_markup: keyboard
                })
            }
        ).row()
    }
}

export const getMyAppsMenu = new Menu("getMyAppsMenu")
getMyAppsMenu.dynamic(getMyInProgressApps)