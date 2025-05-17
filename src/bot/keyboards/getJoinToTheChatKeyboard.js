import { InlineKeyboard } from 'grammy'

export const getJoinToTheChatKeyboard = (inviteLink) => {
    if (!inviteLink) return null
    
    return new InlineKeyboard().url('Присоединиться к чату', inviteLink)
}