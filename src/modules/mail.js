import nodemailer from 'nodemailer'
import config from '../config/config.js'
import logger from '../utils/logger.js'

export default class Mail{
    constructor(){
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.USER_GMAIL,
                pass: config.PASS_GMAIL
            }
        })
    }

    send = async (user, subject, html) => {
        const result = await this.transport.sendMail({
            from: config.USER_GMAIL,
            to: user?.email || user,
            subject,
            html
        })

        //logger.debug(result)

        return result
    }
}