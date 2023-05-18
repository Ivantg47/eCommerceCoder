import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program.option('-p <port>', 'Puerto servidor')
        .option('--mode <mode>', 'Modo de trabajo', 'DEV')
        .option('--store <store>', 'Tipo de persistencia')

program.parse()

const enviroment = program.opts().mode

dotenv.config({
    path: enviroment=="PRODUCTION" ? "./production.env" : './.env'
})

export default {
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    COOKIE_NAME_JWT: process.env.COOKIE_NAME_JWT,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    USER_BD: process.env.USER_BD,
    PASSWORD_BD: process.env.PASSWORD_BD,
    MONGO_URL: process.env.MONGO_URL,
    BD_NAME: process.env.BD_NAME,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALL_BACK_URL: process.env.CALL_BACK_URL,
    PORT: program.opts().p || process.env.PORT,
    PERCISTRENCE: program.opts().store || process.env.PERCISTRENCE,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MODE: program.opts().mode,
    USER_GMAIL: process.env.USER_GMAIL,
    PASS_GMAIL: process.env.PASS_GMAIL,
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        databaseURL: process.env.DATABASE_URL,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID
    }
}
