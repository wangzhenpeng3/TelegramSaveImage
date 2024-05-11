import Router from "koa-router"
import * as controller from '../controller'
import combineRouters from "koa-combine-routers"
const router = new Router()

router.get('/404', controller.errorHandler)
router.get('/downloadImage', controller.downloadImageHandler);
router.get('/getFileAll', controller.getFileAllHandler);
// 测试页
router.get('/test', controller.testHandler)
// Server Sent Events 协议测试
router.get('/sse', controller.sseHandler)

const routers = combineRouters(router)
export default routers;