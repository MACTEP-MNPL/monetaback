import {Keyboard} from "grammy"

export const ownerKeyboard = new Keyboard()

ownerKeyboard
    .text('🟢 Создать заявку')
    .text('🔥 Новые заявки').row()
    .text('🔄 Заявки в работе ')
    .text('✅ Выполненные сегодня').row()
    .text('🔍 Найти заявку по ID')
    .text('🔄 Все заявки').row()
    .text('🎯 Мои заявки')
    .text('💰 Маржа').row().resized()



