import Koa from "koa"
import routers from "./routers"
import cors from "@koa/cors"
export const app = new Koa()

// const env = process.env.NODE_ENV
// let envPath = path.resolve(__dirname, '../.env')
// if (env === 'test') {
//     envPath = path.resolve(__dirname, '../.test.env')
// } else if (env === 'production') {
//     envPath = path.resolve(__dirname, '../.prod.env')
// }
// if (fs.existsSync(envPath)) {
//     dotenv.config({path: envPath})
// } else {
//     process.exit(1)
// }
app.use(cors());

app.use(cors({
    origin: '*', // 允许来自所有域名的请求
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], // 设置获取其他自定义字段
    maxAge: 5, // 该字段可选，用来指定本次预检请求的有效期，单位为秒
    credentials: true, // 是否允许发送Cookie
    keepHeadersOnError: true // 出现错误时是否添加头信息
}));
app.use(routers())

const port = 9999
app.listen(port, () => {
    console.log(`server is running on ${port}`)
})
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();