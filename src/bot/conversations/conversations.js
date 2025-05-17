import {Composer} from "grammy"
import {createNewAppByOldOneConversation} from "./createNewAppByOldOneConversation.js"
import {createNewAppByOldOneAndTake} from "./createNewAppByOldOneConversation.js"
import {createConversation} from "@grammyjs/conversations"
import {getApplicationByIdConversation} from "./getApplicationByIdConversation.js"
import {filterByDateConversation} from "./filterByDateConversation.js"
import {filterByTypeConversation} from "./filterByTypeConversation.js"
import {changeMarginConversation} from "./changeMarginConversation.js"
export const convers = new Composer()


convers.use(createConversation(createNewAppByOldOneConversation))
convers.use(createConversation(createNewAppByOldOneAndTake))
convers.use(createConversation(getApplicationByIdConversation))
convers.use(createConversation(changeMarginConversation))

convers.use(createConversation(filterByDateConversation))
convers.use(createConversation(filterByTypeConversation))
