import {db} from "../index.js"

export const createNewChat = async (ctx) => {
   const {id} = ctx.chat
   
   // Check if chat already exists
   const [existingChats] = await db.execute(
       'SELECT id FROM chats WHERE chat_id = ?',
       [id]
   )

   if (existingChats && existingChats.length > 0) {
       return null // Chat already exists
   }

   const chat = await ctx.api.getChat(id)
   let invite_link = chat.invite_link

   // Create invite link if it doesn't exist
   if (!invite_link) {
       const newLink = await ctx.api.createChatInviteLink(id)
       invite_link = newLink.invite_link
   }

   const response = await db.execute(
       'INSERT INTO chats (chat_id, invite_link, application_id) VALUES (?, ?, NULL)', 
       [id, invite_link]
   )

   await ctx.reply('👍')
   
   return response
}

export const connectChatWithApplication = async (applicationId) => {
   const [rows] = await db.execute('SELECT id, chat_id FROM chats WHERE application_id IS NULL LIMIT 1')
   
   if (!rows || rows.length === 0) {
       throw new Error('No available chats found')
   }

   const {id, chat_id} = rows[0]

   await db.execute('UPDATE chats SET application_id = ? WHERE id = ?', [applicationId, id])
   await db.execute('UPDATE applications SET chat_id = ? WHERE id = ?', [chat_id, applicationId])

   return {chat_id, id}
}


