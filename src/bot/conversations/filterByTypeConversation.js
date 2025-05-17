import {getAllApplicationsMenu} from "../menus/getAllApplicationsMenu.js"
import { getRussianApplicatoinType } from "../utils/getRussianApplicatoinType.js";

export const filterByTypeConversation = async (conversation, ctx) => {

    const session = await conversation.external((ctx) => ctx.session);

    await ctx.reply(
        "Выберите тип заявки:\n\n" +
        "<code>ВЭД</code>\n" +
        "<code>SWIFT/SEPA</code>\n" +
        "<code>НАЛИЧНЫЕ ОБМЕН</code>\n" +
        "<code>НАЛИЧНЫЕ ВЫДАЧА</code>", {
            parse_mode: "HTML"
        }

    );

    const choice = await conversation.form.text();
    
    const type = choice === 'ВЭД' ? 'fea' : choice === 'SWIFT/SEPA' ? 'swift' : choice === 'НАЛИЧНЫЕ ОБМЕН' ? 'cash_exchange' : 'cash_withdrawal'

    if (type) {
        session.filters = {
            ...session.filters,

            type
        };

        session.currentPage = 1;

        await ctx.reply("Фильтр применен", {
            //reply_markup: getAllApplicationsMenu
        });

    } else {
        await ctx.reply("Неверный выбор. Попробуйте снова.");
    }
};
