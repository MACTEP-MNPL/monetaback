import {getApplicationById} from "../../db/application.js"
import {db} from "../../index.js"
import {getJoinToTheChatKeyboard} from "../keyboards/getJoinToTheChatKeyboard.js"
import {getRussianApplicationStatus} from "../utils/getRussianApplicationStatus.js"
import {getUsernameByTelegramId} from "../../db/user.js"
export const getApplicationDetailsMessage = async (applicationId, application) => {

    let details = ''

    switch(application.type) {
        case 'fea':
            const [[feaDetails]] = await db.execute(
                'SELECT * FROM fea_applications WHERE id = ?',
                [applicationId]
            )
            details = `
🔹 Тип: ВЭД
🔹 Имя: ${feaDetails.name}
🔹 Дата: ${feaDetails.date}
🔹 Офис: ${feaDetails.office}
🔹 Тип услуги: ${feaDetails.type_of_service}
🔹 Назначение платежа: ${feaDetails.payment_assignment}
🔹 Юрисдикция нахождения средств: ${feaDetails.funds_jurisdiction}
🔹 Юрисдикция поступления средств: ${feaDetails.intake_money_jurisdiction}
🔹 Способ оплаты: ${feaDetails.payment_method}
🔹 Сумма: ${feaDetails.amount}
🔹 Статус: ${getRussianApplicationStatus(application.status)}
${(application.status === 'in_progress' || application.status === 'completed') ? `\n👮‍♂️ Менеджер: @${await getUsernameByTelegramId(application.manager_tg_id)} \n👤 Клиент: @${await getUsernameByTelegramId(application.user_tg_id)}` : ''}`


            break;

        case 'swift':

            const [[swiftDetails]] = await db.execute(
                'SELECT * FROM swift_applications WHERE id = ?',
                [applicationId]
            )
            details = `
🔹 Тип: SWIFT \\ SEPA
🔹 Имя: ${swiftDetails.name}
🔹 Дата: ${swiftDetails.date}
🔹 Офис: ${swiftDetails.office}
🔹 Страна: ${swiftDetails.country}
🔹 Назначение платежа: ${swiftDetails.payment_assignment}
🔹 Платежная система: ${swiftDetails.payment_system}
🔹 Страна зачисления: ${swiftDetails.country}
🔹 Валюта на сделке: ${swiftDetails.currency}
🔹 Валюта зачисления: ${swiftDetails.intake_currency}
🔹 Сумма: ${swiftDetails.amount}
🔹 Статус: ${getRussianApplicationStatus(application.status)}
${(application.status === 'in_progress' || application.status === 'completed') ? `\n👮‍♂️ Менеджер: @${await getUsernameByTelegramId(application.manager_tg_id)}\n👤 Клиент: @${await getUsernameByTelegramId(application.user_tg_id)}` : ''}`
            break;
        case 'cash_exchange':


            const [[cashExchangeDetails]] = await db.execute(
                'SELECT * FROM cash_exchange_applications WHERE id = ?',
                [applicationId]
            )
            details = `
🔹 Тип: Обмен валют
🔹 Имя: ${cashExchangeDetails.name}
🔹 Дата: ${cashExchangeDetails.date}
🔹 Офис: ${cashExchangeDetails.office}
🔹 Отдает: ${cashExchangeDetails.give_amount} ${cashExchangeDetails.give_amount_currency}
🔹 Получает: ${cashExchangeDetails.get_amount} ${cashExchangeDetails.get_amount_currency}
🔹 Курс: ${cashExchangeDetails.exchange_rate}
🔹 Статус: ${getRussianApplicationStatus(application.status)}
${(application.status === 'in_progress' || application.status === 'completed') ? `\n👮‍♂️ Менеджер: @${await getUsernameByTelegramId(application.manager_tg_id)} \n👤 Клиент: @${await getUsernameByTelegramId(application.user_tg_id)}` : ''}`
            break;
        case 'cash_withdrawal':

            const [[cashWithdrawalDetails]] = await db.execute(
                'SELECT * FROM cash_withdrawal_applications WHERE id = ?',
                [applicationId]
            )
            details = `
🔹 Тип: Выдача наличных
🔹 Имя: ${cashWithdrawalDetails.name}
🔹 Дата: ${cashWithdrawalDetails.date}
🔹 Офис: ${cashWithdrawalDetails.office}
🔹 Страна выдачи: ${cashWithdrawalDetails.country}
🔹 Валюта на сделке: ${cashWithdrawalDetails.currency}
🔹 Город выдачи: ${cashWithdrawalDetails.city}
🔹 Валюта выдачи: ${cashWithdrawalDetails.cash_currency}
🔹 Сумма: ${cashWithdrawalDetails.amount}
🔹 Статус: ${getRussianApplicationStatus(application.status)}
${(application.status === 'in_progress' || application.status === 'completed') ? `\n👮‍♂️ Менеджер: @${await getUsernameByTelegramId(application.manager_tg_id)} \n👤 Клиент: @${await getUsernameByTelegramId(application.user_tg_id)}` : ''}`
            break;

    }
    return details
}

export const getNewApplicationMessage = async (applicationId) => {

    const application = await getApplicationById(applicationId)

    const details = await getApplicationDetailsMessage(applicationId, application)

    return {
        text: `<b>🔥 Новая заявка #${applicationId}</b>\n${details}`,
        keyboard: getJoinToTheChatKeyboard(application.invite_link)
    }
}

export const getApplicationMessage = async (applicationId) => {
    const application = await getApplicationById(applicationId)
    const details = await getApplicationDetailsMessage(applicationId, application)

    return {
        text: `<b>🔷 Заявка #${applicationId}</b>\n${details}`,
        keyboard: getJoinToTheChatKeyboard(application.invite_link)
    }
}
export const getManagerAppearanceMessage = () => {
    return {
        text: `<b>👨‍💼 Менеджер присоединился к чату</b>\n\nМенеджер ответит на ваши вопросы и поможет с заявкой.`,
        parse_mode: 'HTML'
    }
}

export const getApplicationClosedMessage = () => {
    return {
        text: `<b>✅ Заявка выполнена</b>\n\nСпасибо за обращение в MONETAZONE! Если вам еще понадобятся наши услуги, пишите в этот чат, менеджеры всегда на связи.`,
        parse_mode: 'HTML'
    }
}
