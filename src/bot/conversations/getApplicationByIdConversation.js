import {getApplicationMessage} from "../messages/messages.js"

export const getApplicationByIdConversation = async (conversation, ctx) => {
   try {
    await ctx.reply('Введите числовое ID заявки' + '\n \n' + 'Пример: 314')

    const applicationId = await conversation.form.text()

    const {text, keyboard} = await getApplicationMessage(applicationId)

    await ctx.reply(text, {parse_mode: 'HTML', reply_markup: keyboard})
   } catch (error) {
    
    await ctx.reply('❌ Заявки с таким ID не существует')
    throw error
   }
}



