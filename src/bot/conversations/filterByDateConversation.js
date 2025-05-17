import {getAllApplicationsMenu} from "../menus/getAllApplicationsMenu.js"

export const filterByDateConversation = async (conversation, ctx) => {
    await ctx.reply("Введите начальную дату (ДД.ММ.ГГГГ):" + "\n \n" + 'В формате: день.месяц.год' + '\n' + 'Пример: <code>' + (new Date().getDate()).toString().padStart(2, '0') + '.' + ((new Date().getMonth() + 1)).toString().padStart(2, '0') + '.' + new Date().getFullYear() + '</code>', {parse_mode: 'HTML'})
    const dateFrom = await conversation.form.text();

    await ctx.reply("Введите конечную дату (ДД.ММ.ГГГГ):" + "\n \n" + 'В формате: день.месяц.год' + '\n' + 'Пример: <code>' + (new Date().getDate()).toString().padStart(2, '0') + '.' + ((new Date().getMonth() + 1)).toString().padStart(2, '0') + '.' + new Date().getFullYear() + '</code>', {parse_mode: 'HTML'})
    const dateTo = await conversation.form.text();

    // Parse and validate dates
    try {
        const [fromDay, fromMonth, fromYear] = dateFrom.split('.');
        const [toDay, toMonth, toYear] = dateTo.split('.');
        
        const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
        const toDate = new Date(toYear, toMonth - 1, toDay);

        const session = await conversation.external((ctx) => ctx.session);

        session.filters = {
            ...session.filters,
            dateFrom: toDate,
            dateTo: fromDate
        };


        session.currentPage = 1;

        await conversation.external((ctx) => {
            ctx.session = session;
          });

        await ctx.reply("Фильтры применены", {
            //reply_markup: getAllApplicationsMenu
        });

    } catch (error) {
        console.error('Date filter error:', error);
        await ctx.reply("Неверный формат даты. Попробуйте снова.");
        return;
    }
};
