import passport, { Passport } from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { createHash, extractCookie, generateToken, isValidPassword } from '../utils.js'
import config from './config.js'
import { UserService } from '../repositories/index_repository.js'
import logger from '../utils/logger.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy ({

        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: config.JWT_PRIVATE_KEY

    }, async (jwt_payload, done) => {
        try {

            return done(null, jwt_payload)

        } catch (error) {

            return done(error)

        }
    }))

    passport.use('github', new GitHubStrategy(
        {
            clientID: config.CLIENT_ID,
            clientSecret: config.CLIENT_SECRET,
            callbackURL: config.CALL_BACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            
            try {
                logger.debug("git")
                let user = await UserService.getUserByEmail(profile._json.email)
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name, 
                        last_name: '', 
                        email: profile._json.email,
                        password: '',
                        method: 'GITHUB'
                    }

                    let result = await UserService.addUser(newUser)
                    return done(null, result)

                } else {
                    return done(null, user)
                }
                
            } catch (error) {
                return done('error to login with github' + error)
            }
        }
    ))

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            const {first_name, last_name, email, role} =  req.body //req.query
            
            try {
            
                const user = await UserService.getUserByEmail(username)
                
                if (user) {
                    
                    return done(null, false)
                }

                const newUser = {
                    first_name, 
                    last_name, 
                    email,
                    password: createHash(password),
                    role,
                    method: 'LOCAL'
                }
                
                let result = await UserService.addUser(newUser)
                
                return done(null, result)
                
            } catch (error) {
                logger.error(error.message);
                return done('[LOCAL] Error al registrar '+ error)
            }
        }
    ))
    
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {
            try {
                
                const user = await UserService.getUserByEmail(username)
                
                if (!user) {
                    console.error('Usuario no existe');
                    return done(null,false)
                }
                
                if(!isValidPassword(user, password)) return done(null,false)
                
                delete user.password
                const date = new Date()

                await UserService.updateUser(user?._id || user?.id, {last_connection: date.toString()})

                user.token = generateToken(user)
                
                return done(null,user)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        try {
            const id = user._id || user.id
            done(null, id)
        } catch (error) {
            logger.error(error.message);
        }
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserService.getUserById(id)
            return done(null,user)
        } catch (error) {
            logger.error(error.message);
        }
    })

}

export default initializePassport