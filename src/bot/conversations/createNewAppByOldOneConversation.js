import { getChatByApplicationId } from "../../db/chat.js"
import { getApplicationById } from "../../db/application.js"
import { createApplicationWithExistingChat } from "../../db/application.js"
import { getApplicationDetailsMessage } from "../messages/messages.js"
import { createFeaTypeApplication } from "../../server/createFeaTypeApplication.js"
import { createSwiftTypeApplication } from "../../server/createSwiftTypeApplication.js"
import { createCashTypeApplication } from "../../server/createCashTypeApplication.js"
import { InlineKeyboard } from "grammy"
import { db } from "../../index.js"


const feaTypeWay = async (conversation, ctx, chatId) => {

    await ctx.reply('Имя:')
    const name = await conversation.form.text()

    await ctx.reply('Офис: \n<code>Moscow City, Башня Федерация</code> \n<code>Южное Тушино, Строительный Проезд 7а</code>', {parse_mode: 'HTML'})
    const office = await conversation.form.text()

    await ctx.reply('Тип услуги: \n<code>Платёжные агент</code> \n<code>Возврат валютной выручки</code>', {parse_mode: 'HTML'})
    const typeOfService = await conversation.form.text()

    await ctx.reply('Дата сделки:' + '\n \n' + 'В формате: день.месяц.год' + '\n' + 'Пример: <code>' + (new Date().getDate()).toString().padStart(2, '0') + '.' + ((new Date().getMonth() + 1)).toString().padStart(2, '0') + '.' + new Date().getFullYear() + '</code>',
    {parse_mode: 'HTML'})

    const date = await conversation.form.text()

    await ctx.reply('Назначение платежа:')
    const paymentAssignment = await conversation.form.text()

    await ctx.reply('Юрисдикция нахождения средств:')
    const fundsJurisdiction = await conversation.form.text()

    await ctx.reply('Юрисдикция поступления средств:')
    const intakeMoneyJurisdiction = await conversation.form.text()

    await ctx.reply('Сумма сделки:')
    const amount = await conversation.form.text()

    await ctx.reply('Способ оплаты:')
    const paymentMethod = await conversation.form.text()

    const feaApplication = {
        ip: 'telegram',
        body: {
            name,
            office,
            date,
            details: {
                typeOfService,
                paymentAssignment,
                fundsJurisdiction,
                intakeMoneyJurisdiction,
                amount,
                paymentMethod
            }
        }
    }

    const applicationId = await conversation.external(() => createApplicationWithExistingChat('fea', chatId))


    await conversation.external(() => createFeaTypeApplication(feaApplication, applicationId))
    
    const application = await conversation.external(() => getApplicationById(applicationId))
    
    const applicationDetails = await conversation.external(() => getApplicationDetailsMessage(applicationId, application))
    
    await ctx.api.sendMessage(chatId, 'Ваша новая заявка: \n' + applicationDetails, {parse_mode: 'HTML'})

    return applicationId
}

const swiftTypeWay = async (conversation, ctx, chatId) => {

    await ctx.reply('Имя:')
    const name = await conversation.form.text()

    await ctx.reply('Офис: \n<code>Moscow City, Башня Федерация</code> \n<code>Южное Тушино, Строительный Проезд 7а</code>', {parse_mode: 'HTML'})
    const office = await conversation.form.text()

    await ctx.reply('Платежная система: \n<code>Swift</code> \n<code>Sepa</code>', {parse_mode: 'HTML'})
    const paymentSystem = await conversation.form.text()

    await ctx.reply('Дата сделки:' + '\n \n' + 'В формате: день.месяц.год' + '\n' + 'Пример: <code>' + (new Date().getDate()).toString().padStart(2, '0') + '.' + ((new Date().getMonth() + 1)).toString().padStart(2, '0') + '.' + new Date().getFullYear() + '</code>',
    {parse_mode: 'HTML'})

    const date = await conversation.form.text()

    await ctx.reply('Назначение платежа:')
    const paymentAssignment = await conversation.form.text()

    await ctx.reply('Валюта на сделке:')
    const currency = await conversation.form.text()

    await ctx.reply('Страна зачисления:')
    const country = await conversation.form.text()

    await ctx.reply('Сумма сделки:')
    const amount = await conversation.form.text()

    await ctx.reply('Валюта зачисления:' + '\n' + '<code>RUB</code> \n<code>USD</code> \n<code>EUR</code> \n<code>USDT TRC20</code>', {parse_mode: 'HTML'})
    const intakeCurrency = await conversation.form.text()

    const swiftApplication = {
        ip: 'telegram',
        body: {
            name,
            office,
            date,
            details: {
                paymentSystem,
                paymentAssignment,
                currency,
                country,
                amount,
                intakeCurrency

            }
        }
    }

    const applicationId = await conversation.external(() => createApplicationWithExistingChat('swift', chatId))

    await conversation.external(() => createSwiftTypeApplication(swiftApplication, applicationId))
    
    const application = await conversation.external(() => getApplicationById(applicationId))
    
    const applicationDetails = await conversation.external(() => getApplicationDetailsMessage(applicationId, application))

    
    await ctx.api.sendMessage(chatId, 'Ваша новая заявка: \n' + applicationDetails, {parse_mode: 'HTML'})

    return applicationId
}

const cashExchangeTypeWay = async (conversation, ctx, chatId) => {

    await ctx.reply('Имя:')
    const name = await conversation.form.text()

    await ctx.reply('Офис: \n<code>Moscow City, Башня Федерация</code> \n<code>Южное Тушино, Строительный Проезд 7а</code>', {parse_mode: 'HTML'})
    const office = await conversation.form.text()

    await ctx.reply('Дата сделки:' + '\n \n' + 'В формате: день.месяц.год' + '\n' + 'Пример: <code>' + (new Date().getDate()).toString().padStart(2, '0') + '.' + ((new Date().getMonth() + 1)).toString().padStart(2, '0') + '.' + new Date().getFullYear() + '</code>',
    {parse_mode: 'HTML'})
    const date = await conversation.form.text()

    await ctx.reply('Валюта отдачи:' + '\n' + '<code>RUB</code> \n<code>USD</code> \n<code>EUR</code> \n<code>USDT TRC20</code>', {parse_mode: 'HTML'})
    const giveAmountCurrency = await conversation.form.text()

    await ctx.reply('Сумма отдачи:' + '\n' + '<b>Только число</b>', {parse_mode: 'HTML'})
    const giveAmount = await conversation.form.number()


    await ctx.reply('Валюта получения:' + '\n' + '<code>RUB</code> \n<code>USD</code> \n<code>EUR</code> \n<code>USDT TRC20</code>', {parse_mode: 'HTML'})
    const getAmountCurrency = await conversation.form.text()

    await ctx.reply('Сумма получения:' + '\n' + '<b>Только число</b>', {parse_mode: 'HTML'})
    const getAmount = await conversation.form.number()


    await ctx.reply('Курс обмена:' + '\n' + '<b>Только число</b>', {parse_mode: 'HTML'})
    const rate = await conversation.form.number()


    const cashExchangeApplication = {
        ip: 'telegram',
        body: {
            name,
            office,
            date,
            type: 'cash_exchange',
            details: {
                giveAmountCurrency,
                giveAmount,
                getAmountCurrency,
                getAmount,
                rate
            }
        }
    }

    const applicationId = await conversation.external(() => createApplicationWithExistingChat('cash_exchange', chatId))


    await conversation.external(() => createCashTypeApplication(cashExchangeApplication, applicationId))
    
    const application = await conversation.external(() => getApplicationById(applicationId))
    
    const applicationDetails = await conversation.external(() => getApplicationDetailsMessage(applicationId, application))

    
    await ctx.api.sendMessage(chatId, 'Ваша новая заявка: \n' + applicationDetails, {parse_mode: 'HTML'})

    return applicationId
}

const cashWithdrawalTypeWay = async (conversation, ctx, chatId) => {

    await ctx.reply('Имя:')
    const name = await conversation.form.text()

    await ctx.reply('Офис: \n<code>Moscow City, Башня Федерация</code> \n<code>Южное Тушино, Строительный Проезд 7а</code>', {parse_mode: 'HTML'})
    const office = await conversation.form.text()

    await ctx.reply('Дата сделки:' + '\n \n' + 'В формате: день.месяц.год' + '\n' + 'Пример: <code>' + (new Date().getDate()).toString().padStart(2, '0') + '.' + ((new Date().getMonth() + 1)).toString().padStart(2, '0') + '.' + new Date().getFullYear() + '</code>',
    {parse_mode: 'HTML'})
    const date = await conversation.form.text()

    await ctx.reply('Страна:' , {parse_mode: 'HTML'})
    const country = await conversation.form.text()

    await ctx.reply('Валюта на сделке:' + '\n' + '<code>RUB</code> \n<code>USD</code> \n<code>EUR</code> \n<code>USDT</code>', {parse_mode: 'HTML'})
    const currency = await conversation.form.text()

    await ctx.reply('Сумма:' + '\n' + '<b>Только число</b>', {parse_mode: 'HTML'})
    const amount = await conversation.form.number()

    await ctx.reply('Город:' , {parse_mode: 'HTML'})
    const city = await conversation.form.text()

    await ctx.reply('Валюта выдачи:', {parse_mode: 'HTML'})
    const cashCurrency = await conversation.form.text()


    const cashWithdrawalApplication = {
        ip: 'telegram',
        body: {
            name,
            office,
            date,
            type: 'cash_withdrawal',

            details: {
                amount,
                country,
                currency,
                city,
                cashCurrency
            }

        }
    }

    const applicationId = await conversation.external(() => createApplicationWithExistingChat('cash_withdrawal', chatId))

    await conversation.external(() => createCashTypeApplication(cashWithdrawalApplication, applicationId))
    
    const application = await conversation.external(() => getApplicationById(applicationId))
    
    const applicationDetails = await conversation.external(() => getApplicationDetailsMessage(applicationId, application))

    await ctx.api.sendMessage(chatId, 'Ваша новая заявка: \n' + applicationDetails, {parse_mode: 'HTML'})

    return applicationId
}


export const createNewAppByOldOneConversation = async (conversation, ctx) => {
    await ctx.reply('1️⃣ Введите числовое ID чата, в котором вы хотите создать заявку' 
        + '\n \n' 
        + 'Пример: 112')

        const chatId = await conversation.form.number()

        const chat = await conversation.external(() => getChatByApplicationId(chatId))
        
        if (!chat) {
            await ctx.reply('❌ Чата с таким ID не существует!')
            return
        }

        const oldApplication = await conversation.external(() => getApplicationById(chat.application_id))

        if (!oldApplication) {
            await ctx.reply('⛔️ Чат существует, но заявка не найдена! Свяжитесь с разработчиком!')
            return
        }

        if(oldApplication.status !== 'completed') {
            await ctx.reply('❌ Заявка в этом чате ещё активна! Завершите её, прежде чем создавать новую.')
            return
        }


        await ctx.reply('2️⃣ Введите тип заявки, которую вы хотите создать' + 
            '\n \n' + 

            'Типы заявок: \n <code>ВЭД</code> \n <code>SWIFT/SEPA</code> \n <code>НАЛИЧНЫЕ ОБМЕН</code> \n <code>НАЛИЧНЫЕ ВЫДАЧА</code>',
        {
            parse_mode: 'HTML'
        })



        const applicationTypeRussian = await conversation.form.text()

        if(!['ВЭД', 'SWIFT/SEPA', 'НАЛИЧНЫЕ ОБМЕН', 'НАЛИЧНЫЕ ВЫДАЧА'].includes(applicationTypeRussian)) {
            await ctx.reply('❌ Неверный тип заявки! Укажите один из предложенных вариантов: \n <code>ВЭД</code>, <code>SWIFT/SEPA</code>, <code>НАЛИЧНЫЕ ОБМЕН</code>, <code>НАЛИЧНЫЕ ВЫДАЧА</code>'
                , {parse_mode: 'HTML'}
            )
            return
        }

        const applicationType = applicationTypeRussian === 'ВЭД' ? 'fea' : applicationTypeRussian === 'SWIFT/SEPA' ? 'swift' : applicationTypeRussian === 'НАЛИЧНЫЕ ОБМЕН' ? 'cash_exchange' : 'cash_withdrawal'

        await ctx.reply('3️⃣ Заполняйте поля заявки')

        let applicationId = null

        switch(applicationType) {
            case 'fea':
                applicationId = await feaTypeWay(conversation, ctx, chat.chat_id)
                break
            case 'swift':
                applicationId = await swiftTypeWay(conversation, ctx, chat.chat_id)
                break
            case 'cash_exchange':
                applicationId = await cashExchangeTypeWay(conversation, ctx, chat.chat_id)
                break
            case 'cash_withdrawal':

                applicationId = await cashWithdrawalTypeWay(conversation, ctx, chat.chat_id)
                break

        }

        await ctx.reply('Заявка была успешно создана!')

        await db.execute(
            'UPDATE applications SET status = "viewed", user_tg_id = ? WHERE id = ?',
            [oldApplication.user_tg_id, applicationId]
        )

        //РАССЫЛКА МЕНЕДЖЕРАМ


        const [managers] = await db.execute(
            'SELECT id FROM users WHERE role IN ("manager", "owner")'
        )

        const application = await conversation.external(() => getApplicationById(applicationId))

        const applicationMessage = `🔷 <b>Новая заявка #${applicationId}</b>\n` + await conversation.external(() => getApplicationDetailsMessage(applicationId, application))


        if (managers && applicationMessage) {
            for (const manager of managers) {
                try {
                    const sentMessage = await ctx.api.sendMessage(manager.id, applicationMessage, {
                        reply_markup: new InlineKeyboard().url('Присоединиться к чату', application.invite_link),
                        parse_mode: 'HTML'
                    })
                    
                    await db.execute(
                        'INSERT INTO notification_messages (application_id, manager_id, message_id) VALUES (?, ?, ?)',
                        [applicationId, manager.id, sentMessage.message_id]
                    )
                } catch (error) {
                    console.error(`Failed to notify manager ${manager.id}:`, error)
                }
            }
        }
}

export const createNewAppByOldOneAndTake = async (conversation, ctx) => {
    await ctx.reply('1️⃣ Введите числовое ID чата, в котором вы хотите создать заявку' 
        + '\n \n' 
        + 'Пример: 112')

        const chatId = await conversation.form.number()

        const chat = await conversation.external(() => getChatByApplicationId(chatId))
        
        if (!chat) {
            await ctx.reply('❌ Чата с таким ID не существует!')
            return
        }

        const oldApplication = await conversation.external(() => getApplicationById(chat.application_id))

        if (!oldApplication) {
            await ctx.reply('⛔️ Чат существует, но заявка не найдена! Свяжитесь с разработчиком!')
            return
        }

        if(oldApplication.status !== 'completed') {
            await ctx.reply('❌ Заявка в этом чате ещё активна! Завершите её, прежде чем создавать новую.')
            return
        }

        await ctx.reply('2️⃣ Введите тип заявки, которую вы хотите создать' + 
            '\n \n' + 
            'Типы заявок: \n <code>ВЭД</code> \n <code>SWIFT/SEPA</code> \n <code>НАЛИЧНЫЕ ОБМЕН</code> \n <code>НАЛИЧНЫЕ ВЫДАЧА</code>',
        {
            parse_mode: 'HTML'
        })



        const applicationTypeRussian = await conversation.form.text()

        if(!['ВЭД', 'SWIFT/SEPA', 'НАЛИЧНЫЕ ОБМЕН', 'НАЛИЧНЫЕ ВЫДАЧА'].includes(applicationTypeRussian)) {
            await ctx.reply('❌ Неверный тип заявки! Укажите один из предложенных вариантов: \n <code>ВЭД</code>, <code>SWIFT/SEPA</code>, <code>НАЛИЧНЫЕ ОБМЕН</code>, <code>НАЛИЧНЫЕ ВЫДАЧА</code>'
                , {parse_mode: 'HTML'}
            )
            return
        }

        const applicationType = applicationTypeRussian === 'ВЭД' ? 'fea' : applicationTypeRussian === 'SWIFT/SEPA' ? 'swift' : applicationTypeRussian === 'НАЛИЧНЫЕ ОБМЕН' ? 'cash_exchange' : 'cash_withdrawal'

        await ctx.reply('3️⃣ Заполняйте поля заявки')

        let applicationId = null

        switch(applicationType) {
            case 'fea':
                applicationId = await feaTypeWay(conversation, ctx, chat.chat_id)
                break
            case 'swift':
                applicationId = await swiftTypeWay(conversation, ctx, chat.chat_id)
                break
            case 'cash_exchange':
                applicationId = await cashExchangeTypeWay(conversation, ctx, chat.chat_id)
                break
            case 'cash_withdrawal':

                applicationId = await cashWithdrawalTypeWay(conversation, ctx, chat.chat_id)
                break

        }

        await db.execute(
            'UPDATE applications SET status = "in_progress", user_tg_id = ?, manager_tg_id = ? WHERE id = ?',
            [oldApplication.user_tg_id, ctx.from.id, applicationId]
        )

        await ctx.reply('Заявка была успешно создана!')
}
