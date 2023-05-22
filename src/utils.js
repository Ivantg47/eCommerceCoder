import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import config from './config/config.js'
import {faker} from "@faker-js/faker"

faker.locale = 'es'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) => {
    const token = jwt.sign({user}, config.JWT_PRIVATE_KEY, {expiresIn: '24h'})

    return token
}

export const generateTokenUser = (user, secret) => {
    const token = jwt.sign({user}, secret, {expiresIn: '1h'})

    return token
}

export const authTokenUser = (token, secret) => {
    //const payload = jwt.verify(token, secret)
    jwt.verify(token, secret)

}

export const authToken = (req, res, next) => {
    
    const authToken = req.cookies[config.COOKIE_NAME_JWT]
    
    if(!authToken) return res.status(401).render('error/general', {error: "Not Auth", title: 'Error'})

    jwt.verify(authToken, config.JWT_PRIVATE_KEY, (error, config) => {
        if(error) return res.status(403).render('error/general', {error: 'Not authorized', title: 'Error'})
        req.user = config.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err)
            if (!user) {
                return res.status(401).render('error/general',{
                    error: info.messages ? info.messages : info.toString(),
                    title: 'Error'
                })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[config.COOKIE_NAME_JWT] : null
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(),
        code: faker.datatype.string(5),
        stock: faker.datatype.number(100),
        category: faker.commerce.department(),
        status: faker.datatype.boolean()
    }
}


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname
