// import path from 'path'
// import fs from 'fs'
// import dotenv from 'dotenv'
// import { app } from './main'

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

// export const main = koaAdapter(app)