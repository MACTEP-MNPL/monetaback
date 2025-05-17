import {Composer} from "grammy"
import {db} from "../index.js"
import {getNewApplicationMessage} from "./messages/messages.js"
import {bot} from "./bot.js"

export const newUserJoins = new Composer()

newUserJoins.on('chat_member', async (ctx) => {

    console.log("CHAT MEMBER ", ctx.chatMember)

    const oldStatus = ctx.chatMember.old_chat_member.status
    
    if (oldStatus === 'member' || oldStatus === 'administrator' || oldStatus === 'creator') return
    
    console.log("NEW USER JOINED")

    try {
        const chatId = ctx.chat.id

        const userId = ctx.chatMember.from.id

        console.log("CHAT ID ", chatId)
        console.log("USER ID ", userId)

        // Get application and its current status for this chat
        const [rows] = await db.execute(
            'SELECT id, status FROM applications WHERE chat_id = ?',
            [chatId]
        )

        if (!rows || rows.length === 0) return

        const applicationId = rows[rows.length - 1].id
        const currentStatus = rows[rows.length - 1].status
        
        // Get user's role and username
        const [userRows] = await db.execute(
            'SELECT role, username FROM users WHERE id = ?',
            [userId]
        )

        if (!userRows || userRows.length === 0) return

        const userRole = userRows[0].role
        const username = userRows[0].username || userId

        console.log("BEFORE: ", {applicationId, currentStatus, userRole, username})
        
        if (currentStatus === 'new' && userRole === 'user') {
            await db.execute(
                'UPDATE applications SET status = "viewed", user_tg_id = ? WHERE id = ?',
                [userId, applicationId]
            )

            await db.execute('UPDATE application_timestamps SET viewed_at = ? WHERE application_id = ?', [new Date(), applicationId])

            const paddedId = String(applicationId).padStart(6, '0')
            const chatTitle = `🔥 monetazone | ${paddedId}`
            await bot.api.setChatTitle(chatId, chatTitle)

            // Get application details for welcome message
            const applicationMessage = await getNewApplicationMessage(applicationId)
            const welcomeMessage = `
Ⓜ️ <b><a href="https://monetazone.com/">MONETAZONE</a> это быстрые и надежные международные переводы и платежи.</b>

${applicationMessage.text}

🛜 Уведомление о вашей заявке уже отправлено менеджеру.

🚹 Он присоединится к чату в ближайшее время для обработки вашего запроса.

🔵 <b>Пожалуйста, оставайтесь в чате.</b>`

            await ctx.reply(welcomeMessage, {parse_mode: 'HTML'})

            // Continue with manager notifications
            const [managers] = await db.execute(
                'SELECT id FROM users WHERE role IN ("manager", "owner")'
            )

            if (managers && applicationMessage) {
                for (const manager of managers) {
                    try {
                        const sentMessage = await bot.api.sendMessage(manager.id, applicationMessage.text, {
                            reply_markup: applicationMessage.keyboard,
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
        } else if (currentStatus === 'viewed' && (userRole === 'manager' || userRole === 'owner')) {

            await db.execute('UPDATE application_timestamps SET in_progress_at = ? WHERE application_id = ?', [new Date(), applicationId])

            const paddedId = String(applicationId).padStart(6, '0')
            const chatTitle = `🔄 monetazone | ${paddedId}`
            await bot.api.setChatTitle(chatId, chatTitle)

            await ctx.reply('❗️ <b>Менеджер присоединился к чату и готов обработать вашу заявку!</b>', {parse_mode: 'HTML'})

            // Update application status
            await db.execute(
                'UPDATE applications SET status = "in_progress", manager_tg_id = ? WHERE id = ?',
                [userId, applicationId]
            )

            // Get stored message IDs and update them for other managers
            const [messageRows] = await db.execute(
                'SELECT manager_id, message_id FROM notification_messages WHERE application_id = ?',
                [applicationId]
            )

            const notificationText = `➡️ Менеджер @${username} приступил к обработке заявки #${applicationId}`

            for (const row of messageRows) {
                try {
                    // Edit original messages
                    await bot.api.editMessageText(row.manager_id, row.message_id, notificationText)
                } catch (error) {
                    console.error(`Failed to update message for manager ${row.manager_id}:`, error)
                    // If edit fails, send new message
                    await bot.api.sendMessage(row.manager_id, notificationText)
                }
            }
        }
    } catch (error) {
        console.error('Error handling chat member update:', error)
    }
})




