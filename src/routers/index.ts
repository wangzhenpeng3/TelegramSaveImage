import Router from "koa-router"
import * as controller from '../controller'
import combineRouters from "koa-combine-routers"
import axios from "axios"
const router = new Router()

router.get('/404', controller.errorHandler)
router.get('/download-image', controller.downloadImageHandler);
const routers = combineRouters(router)
export default routers;