import {Composer} from "grammy"
import {isAdmin} from "../utils/isAdmin.js"
import {InlineKeyboard} from "grammy"


export const newApplicationHears = new Composer()

newApplicationHears.hears('🟢 Создать заявку', async (ctx) => {
    try {
        if(!(await isAdmin(ctx))) {
            return
        }

        const keyboard = new InlineKeyboard()
            .text(`📋 Просто создать заявку`, 'newAdmApp-create')
            .row()
            .text(`✅ Создать и взять в работу`, 'newAdmApp-take')
            .row()

        await ctx.reply(
            '❗️ Вы создаете новую заявку уже в существующем чате, для создание новой заявки вместе с чатом всегда используйте <a href="https://monetazone.com">сайт</a>' + 
            '\n \n' +
            '<b>Выберите действие:</b>', {
            reply_markup: keyboard,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Error in create application command:', error);
        await ctx.reply("Произошла ошибка при обработке команды.");
    }
});