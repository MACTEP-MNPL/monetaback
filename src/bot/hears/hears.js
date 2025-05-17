import {newApplicationHears} from "./newApplicationHears.js"
import {getViewedApplicationsHears} from "./getViewedApplicationsHears.js"
import {getAppsInProgressHears} from "./getAppsInProgressHears.js"
import {Composer} from "grammy"
import {getComplitedTodayHears} from "./getComplitedTodayHears.js"
import {findApplicationByIdHears} from "./findApplicationByIdHears.js"
import {allApplicationsHears} from "./allApplicationsHears.js"
import {getMyApplicationsHears} from "./getMyApplicationsHears.js"
import {marginHears} from "./marginHears.js"
export const hears = new Composer()


hears.use(newApplicationHears)
hears.use(getViewedApplicationsHears)
hears.use(getAppsInProgressHears)
hears.use(getComplitedTodayHears)
hears.use(findApplicationByIdHears)
hears.use(allApplicationsHears)
hears.use(getMyApplicationsHears)
hears.use(marginHears)
