import dotenv from 'dotenv'
import {Bot, session} from "grammy"
import {GrammyError, HttpError} from "grammy"
import {db} from "../index.js"
import {newUserJoins} from "./newUserJoins.js"
import {commands} from "./commands/commands.js"
import {hears} from "./hears/hears.js"
import {callbackQueries} from "./callbackQueries/callbackQueries.js"
import {convers} from "./conversations/conversations.js"
import {conversations} from "@grammyjs/conversations"
import {menus} from "./menus/menus.js"
dotenv.config()

const {TG_BOT_TOKEN} = process.env

export const bot = new Bot(TG_BOT_TOKEN)

bot.use(session({
    initial() {
      return {};
    },
  }));

bot.use(conversations());

bot.use(async (ctx, next) => {
    try {
        if (!ctx.from) return next()

        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [ctx.from.id]
        )

        if (existingUsers && existingUsers.length > 0) {
          if(existingUsers[0].username !== ctx.from.username) {
            
            let username = ctx.from.username

            if(!username) {
              username = 'Нет юзернейма'
            }

            await db.execute(
                'UPDATE users SET username = ? WHERE id = ?',
                [username, ctx.from.id]
            )
          }

          if (existingUsers[0].is_banned) {
                return
          }
        } else {
            await db.execute(
                'INSERT INTO users (id, username, is_banned) VALUES (?, ?, FALSE)',
                [ctx.from.id, ctx.from.username || null]
            )
        }

        return next()
    } catch (error) {
        console.error('Error in middleware:', error)
        return next()
    }
})

bot.use(newUserJoins)

bot.use(convers)

bot.use(menus)

bot.use(callbackQueries)

bot.use(hears)

bot.use(commands)

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
});

bot.start({ allowed_updates: ['chat_member',"message",
  "edited_message",
  "channel_post",
  "edited_channel_post",
  "business_connection",
  "business_message",
  "edited_business_message",
  "deleted_business_messages",
  "inline_query",
  "chosen_inline_result",
  "callback_query",
  "shipping_query",
  "pre_checkout_query",
  "poll",
  "poll_answer",
  "my_chat_member",
  "chat_join_request",
  "chat_boost",
  "removed_chat_boost"] 
})

