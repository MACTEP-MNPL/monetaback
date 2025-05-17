import {Composer} from "grammy"
import {InlineKeyboard} from "grammy"
import {db} from "../../index.js"

export const marginHears = new Composer()

marginHears.hears('💰 Маржа', async (ctx) => {
    const [rows] = await db.execute(
        'SELECT `value` FROM settings WHERE `key` = ?',
        ['margin']
    )
    await ctx.reply(`💰 Текущая маржа: ${-rows[0]?.value ?? 0}%`, {parse_mode: 'HTML', 
        reply_markup: new InlineKeyboard().text('Изменить маржу', 'change_margin')})
})
