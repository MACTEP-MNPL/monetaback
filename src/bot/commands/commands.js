import {db} from "../../index.js"
import {Composer} from "grammy"
import {getApplicationClosedMessage} from "../messages/messages.js"
import {createNewChat} from "../../server/chat.js"
import {adminKeyboard} from "../keyboards/adminKeyboard.js"
import {isAdmin} from "../utils/isAdmin.js"
import {ownerKeyboard} from "../keyboards/ownerKeyboard.js"
import {isOwner} from "../utils/isOwner.js"

export const commands = new Composer()

commands.command('start', async (ctx) => {

    if(!(await isAdmin(ctx))) {
        await ctx.reply("Привет, я помощник от <b>monetazone</b>! Раньше я был роботом пылесосом, теперь я стажируюсь здесь. К сожалению, я ещё слишком маленький что бы работать самостоятельно. \n\n⏳ <b>Оставайтесь в чате, менеджер скоро присоединится.</b>", {parse_mode: 'HTML'})
        return 
    }

    await ctx.reply("🛠 Панель менеджера", {reply_markup: adminKeyboard})
})

commands.command('owner', async (ctx) => {
    if(!(await isOwner(ctx))) {
        return 
    }

    await ctx.reply("😎 Панель владельца", {reply_markup: ownerKeyboard})
})

commands.command('help', async (ctx) => {
    if(!(await isAdmin(ctx))) {
        return
    }

    await ctx.reply(
        '🆘 Все доступные команды:' +
        '\n' +
        '\n<b>Команды в боте:</b>' +
        '\n/id - Получить свой telegram id' +
        '\n/ban {id} - Забанить пользователя' +
        '\n/manager {id} - Сделать пользователя менеджером' +
        '\n/unban {id} - Разбанить пользователя' +
        '\n/start - Получить меню менеджера' +
        '\n/owner - Получить меню владельца' +

        '\n/help - Получить это сообщение' +


        '\n' +
        '\n<b>Команды в чате:</b>' +
        '\n/close - Закрыть заявку' +
        '\n/new - Внести чат в базу данных' +
        '\n/admin - Стать администратором в чате', 
        {parse_mode: 'HTML'}
    ) 
})

commands.command('manager', async (ctx) => {
    try {

        if (!(await isOwner(ctx))) {
            return
        }

        const userId = ctx.message.text.split(' ')[1]
        if (!userId) {
            await ctx.reply("❌ Укажите telegram ID пользователя: /manager <user_id>")
            return
        }

        const [user] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        )

        if (!user || user.length === 0) {
            await db.execute(
                'INSERT INTO users (id, role, created_at) VALUES (?, ?, ?)',
                [userId, 'manager', new Date()]
            )
        } else {
            await db.execute(
                'UPDATE users SET role = ? WHERE id = ?',
                ['manager', userId]
            )
        }

        await ctx.reply(`✅ Пользователь ${userId} назначен менеджером.`)
    } catch (error) {
        console.error('Error in /manager command:', error)
        await ctx.reply("❌ Произошла ошибка при назначении менеджера.")
    }
})

commands.command('id', async (ctx) => {
    await ctx.reply(`Ваш ID: <code>${ctx.from.id}</code>`, {parse_mode: 'HTML'})
})

commands.command('new', async (ctx) => {
    try {

        await createNewChat(ctx)
    } catch (error) {
        console.error('Error in /new command:', error)
        await ctx.reply("Произошла ошибка при регистрации чата.")
    }
})

commands.command('ban', async (ctx) => {
    try {
        const [admin] = await db.execute(
            'SELECT role FROM users WHERE id = ?',
            [ctx.from.id]
        )

        if (!admin || !['owner', 'manager'].includes(admin[0].role)) {
            return
        }

        const userId = ctx.message.text.split(' ')[1]
        if (!userId) {
            await ctx.reply("Незабывайте указывать id пользователя: /ban <user_id>")
            return
        }

        await db.execute(
            'UPDATE users SET is_banned = TRUE WHERE id = ?',
            [userId]
        )

        await ctx.reply(`Пользователь ${userId} был забанен.`)
    } catch (error) {
        console.error('Error in /ban command:', error)
        await ctx.reply("Произошла ошибка при обработке вашего запроса.")
    }
})

commands.command('unban', async (ctx) => {
    try {
        const [admin] = await db.execute(
            'SELECT role FROM users WHERE id = ?',
            [ctx.from.id]
        )

        if (!admin || !['owner', 'manager'].includes(admin[0].role)) {
            return
        }

        const userId = ctx.message.text.split(' ')[1]
        if (!userId) {
            await ctx.reply("Незабывайте указывать id пользователя: /unban <user_id>")
            return
        }

        await db.execute(
            'UPDATE users SET is_banned = FALSE WHERE id = ?',
            [userId]
        )

        await ctx.reply(`Пользователь ${userId} был разбанен.`)
    } catch (error) {
        console.error('Error in /unban command:', error)
        await ctx.reply("Произошла ошибка при обработке вашего запроса.")
    }
})

commands.command('close', async (ctx) => {
    try {
        // Check if user is manager or owner
        const [admin] = await db.execute(
            'SELECT role FROM users WHERE id = ?',
            [ctx.from.id]
        )

        if (!admin || !['owner', 'manager'].includes(admin[0].role)) {
            return
        }

        // Get chat's application
        const [applications] = await db.execute(
            'SELECT id, status FROM applications WHERE chat_id = ?',
            [ctx.chat.id]
        )

        if (!applications || applications.length === 0) {
            await ctx.reply("❌ Этот чат не связан с заявкой.")
            return
        }

        const application = applications[applications.length - 1]

        if (application.status === 'completed') {
            await ctx.reply("❌ Заявка уже закрыта.")
            return
        }

        // Update application status using the correct ENUM value
        await db.execute(
            'UPDATE applications SET status = "completed" WHERE id = ?',
            [application.id]
        )

        await db.execute('UPDATE application_timestamps SET completed_at = ? WHERE application_id = ?', [new Date(), application.id])


        // Send closure message
        const message = getApplicationClosedMessage()
        await ctx.reply(message.text, { parse_mode: 'HTML' })

        // Update chat title to indicate closure
        const paddedId = String(application.id).padStart(6, '0')
        await ctx.api.setChatTitle(ctx.chat.id, `🤝 monetazone | ${paddedId}`)

    } catch (error) {
        console.error('Error in /close command:', error)
        await ctx.reply("Произошла ошибка при закрытии заявки.")
    }
})

commands.command('admin', async (ctx) => {
    try {
        // Check if command sender is owner
        const [admin] = await db.execute(
            'SELECT role FROM users WHERE id = ?',
            [ctx.from.id]
        )

        if (!(await isAdmin(ctx))) {
            return
        }

        const userId = ctx.from.id

        await ctx.api.promoteChatMember(ctx.chat.id, userId, {
            can_manage_chat: true,
            can_delete_messages: true,
            can_manage_video_chats: true,
            can_restrict_members: true,
            can_promote_members: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true,
        })

        await ctx.api.setChatAdministratorCustomTitle(ctx.chat.id, userId, "менеджер")

        await ctx.reply("✅ Вы стали администратором чата.")
    } catch (error) {
        console.error('Error in /admin command:', error)
        await ctx.reply("❌ Произошла ошибка при назначении администратора. Убедитесь, что бот имеет права администратора в чате.")
    }
})