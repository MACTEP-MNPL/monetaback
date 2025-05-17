import { Composer } from "grammy"

export const callbackQueries = new Composer()


callbackQueries.callbackQuery('newAdmApp-create', async (ctx) => {
    await ctx.conversation.enter("createNewAppByOldOneConversation")
});

callbackQueries.callbackQuery('newAdmApp-take', async (ctx) => {
    await ctx.conversation.enter("createNewAppByOldOneAndTake")
});

callbackQueries.callbackQuery('change_margin', async (ctx) => {
    await ctx.conversation.enter("changeMarginConversation")
})
