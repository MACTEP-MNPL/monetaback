import {Keyboard} from "grammy"

export const adminKeyboard = new Keyboard()

adminKeyboard.text('🟢 Создать заявку')
    .text('🔥 Новые заявки').row()
    .text('🎯 Мои заявки').row().resized()

