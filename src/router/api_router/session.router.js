import MiRouter from "../router.js";
import passport from 'passport'
import config from "../../config/config.js";
import { authToken, authTokenUser, createHash, generateTokenUser, isValidPassword } from "../../utils.js";
import { UserService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";
import { forgot } from "../../modules/html.js";

export default class SessionRouter extends MiRouter {
    init () {

        //<<<<<<<<<<<<<<<<<<<<<<<<<<Crear usuario>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/register', ["PUBLIC"], async (req, res) => {
            
            res.render('session/register', {title: 'Register'})
        })

        this.post('/register', ["PUBLIC"], passport.authenticate('register', {failureRedirect: '/session/failregister'}), async (req, res, next) => {
            
            res.redirect('/session/login')

        })

        this.get('/login', ["PUBLIC"], async (req, res) => {
    
            res.render('session/login', {title: 'Login'})
        
        })
        
        this.post('/login', ["PUBLIC"], passport.authenticate('login', {failureRedirect: '/session/faillogin'}), (req, res, next) => {
            try {
                
                if (!req.user) {
                    return res.status(401).render('error/general', {error: 'Correo incorrecto', title: 'Error'})
                }
        
                req.session.user = req.user
        
                res.cookie(config.COOKIE_NAME_JWT, req.user.token).redirect('/')
                    
            } catch (error) {
                req.logger.error(error.message);
                console.error(error);
                return next()
            }
        })
        
        this.get('/github', ["PUBLIC"], passport.authenticate('github', {scope:['user:email']}), async(req, res) => {})
        
        this.get('/githubcallback', ["PUBLIC"],  passport.authenticate('github', {failureRedirect: '/session/login'}), async(req, res, next) => {
            try {
                req.session.user = req.user
                res.redirect('/')
                
            } catch (error) {
                req.logger.error(error.message);
                console.error(error);
                return next()
            }
        })
        
        this.get('/faillogin', ["PUBLIC"], (req, res) => {
            res.render('error/general',{error: 'Failed login', title: 'Error'})
        })
        
        this.get('/failregister', ["PUBLIC"], (req, res) => {

            res.render('error/general',{error: 'Failed to register', title: 'Error'})
        })
        
        //<<<<<<<<<<<<<<<<<<<<<<<<<< cerrar sesion >>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/logout', ["PUBLIC"], authToken, async (req, res, next) => {
            try {
                req.session.destroy(err => {
                    if(err) return res.status(500).render('error/general', {error: err})
                })
                //return res.status(200).send('Logout success')
                const date = new Date()
                
                await UserService.updateUser(req.user?.id || req.user?._id, {last_connection: date.toString()})

                res.clearCookie(config.COOKIE_NAME_JWT).redirect("/session/login");
        
            } catch (error) {
                req.logger.error(error.message);
                console.error(error);
                return next()
            }
        })
        
        
        //<<<<<<<<<<<<<<<<<<<<<<<<<<restaurar contraseña>>>>>>>>>>>>>>>>>>>>>>>>>>
        this.get('/forgot', ["PUBLIC"], async (req, res) => {
            
            res.render('session/olvido', {title: 'Recuperar Contrasseña'})
        })

        this.post('/forgot', ["PUBLIC"], async (req, res, next) => {
            try {
                const {email} = req.body
                
                const result = await UserService.getUserByEmail(email)
                
                if (!result) {
                    res.render('session/olvido', {title: 'Recuperar Contrasseña', error: true})
                } else {
                    const secret = config.JWT_PRIVATE_KEY + result.password
                    
                    const payload = {
                        id: result.id || result._id,
                        email: result.email
                    }

                    const token = generateTokenUser(payload, secret)
                    const link = `${config.PRINCIPAL_URL}/session/restor-password/${payload.id}/${token}`

                    const subject = 'Recuperación de contraseña'
                    UserService.sendMail(email, forgot(link), subject)
                    
                    res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Correo enviado...'})
                    
                }
        
            } catch (error) {
                req.logger.error(error.message);
                return next()
            }
        })
        
        this.get('/restor-password/:id/:token', ["PUBLIC"], async (req, res, next) => {
            try {
                const { id, token} = req.params
                const user = await UserService.getUserById(id)

                if (!user) {
                    return res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Usuario invalido...'})
                }

                const secret = config.JWT_PRIVATE_KEY + user.password
                
                const result = authTokenUser(token, secret)

                res.render('session/restaurar', {title: 'Recuperar Contrasseña'})
            } catch (error) {
                
                if (error.name = 'JsonWebTokenError') {
                    return res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Enlace invalido o expirado...'})
                }
                req.logger.error(error.message);
                return next()
            }
            
        })
        
        this.post('/restor-password/:id/:token', ["PUBLIC"], async (req, res, next) => {
            try {
                const { id, token} = req.params
                const { password, password2 } = req.body
                
                if (password !== password2) {
                    return res.status(404).send('contraseña debe ser igual')
                }
                
                const user = await UserService.getUserById(id)

                if (!user) {
                    return res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Usuario invalido...'})
                }
                
                if (isValidPassword(user, password)) {
                    return res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Debe utilizar una contraseña distinta a la actualmente configurada'})
                }
                user.password = createHash(password)
                const result = await UserService.updateUser(id, user)
                
                if (!result) {
                    return res.status(500).send('Error al intentar cambiar la contraseña')
                }

                return res.status(200).redirect('/session/login')
                
        
            } catch (error) {
                
                if (error.name === 'JsonWebTokenError') {
                    return res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Enlace invalido o expirado...'})
                }
                req.logger.error(error.message);
                return next()
            }
        })

        this.get('/current', ["USER", "PREMIUM", "ADMIN"], authToken, async (req, res, next) => {
            try {
                //logger.debug(req.user)
                //console.log('user: ',req.user);                
                if(req.user) {
                    const user = req.user
                    if(!user.cart) user.cart = 'No cart'
                    //return res.status(200).render('session/profile', {title: "Perfil", user})
                    return res.status(200).send({status: "succes", payload: user})
                }    

                return res.status(404).send("Not found")

            } catch (error) {
                req.logger.error(error.message);
                return next()               
            }
            
            
        })
    }
}