import {Composer} from "grammy"
import {getViewedAppsMenu} from "./getViewedAppsMenu.js"
import {getInProgressAppsMenu} from "./getInProgressAppsMenu.js"
import {getComplitedTodayMenu} from "./getComplitedTodayMenu.js"
import {getAllApplicationsMenu} from "./getAllApplicationsMenu.js"
import {getMyAppsMenu} from "./getMyApplicationsMenu.js"

export const menus = new Composer()


menus.use(getViewedAppsMenu)
menus.use(getInProgressAppsMenu)
menus.use(getComplitedTodayMenu)
menus.use(getAllApplicationsMenu)
menus.use(getMyAppsMenu)

