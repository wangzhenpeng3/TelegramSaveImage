import Koa from "koa"
import routers from "./routers"
import path from "path"
import fs from "fs"
import dotenv from "dotenv"

export const app = new Koa()

const env = process.env.NODE_ENV
let envPath = path.resolve(__dirname, '../.env')
if (env === 'test') {
    envPath = path.resolve(__dirname, '../.test.env')
} else if (env === 'production') {
    envPath = path.resolve(__dirname, '../.prod.env')
}
if (fs.existsSync(envPath)) {
    dotenv.config({path: envPath})
} else {
    process.exit(1)
}

app.use(routers())

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
