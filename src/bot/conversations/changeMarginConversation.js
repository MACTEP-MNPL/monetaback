import {db} from "../../index.js"

export const changeMarginConversation = async (conversation, ctx) => {
    await ctx.reply('Введите новую маржу:')

    const margin = await conversation.form.text()

    if (isNaN(margin)) {
        await ctx.reply('Маржа должна быть числом!')
        return
    }

    await conversation.external(() => db.execute('UPDATE settings SET value = ? WHERE `key` = ?', [-margin, `margin`]))
    await ctx.reply('Маржа успешно изменена!')
}

