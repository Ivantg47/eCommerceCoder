import MiRouter from "../router.js";
import passport from 'passport'
import config from "../../config/config.js";
import { authToken, authTokenUser, createHash, generateTokenUser, isValidPassword } from "../../utils.js";
import { UserService } from "../../repositories/index_repository.js";
import logger from "../../utils/logger.js";

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
                //const result = await userModel.findOneAndUpdate({email: email, method: 'local'}, {'$set': {password: createHash(password)}})
                logger.debug(JSON.stringify(result))
                if (!result) {
                    res.render('session/olvido', {title: 'Recuperar Contrasseña', error: true})
                } else {
                    const secret = config.JWT_PRIVATE_KEY + result.password
                    req.logger.debug('secret: ', secret)
                    const payload = {
                        id: result.id || result._id,
                        email: result.email
                    }

                    const token = generateTokenUser(payload, secret)
                    const link = `http://127.0.0.1:8080/session/restor-password/${payload.id}/${token}`

                    let html = `<h1>Recuperación de contraseña</h1>
                    <p>Apreciado cliente,
                    <br>
                    Recientemente se a solicitado restablecer la contraseña para acceder a su cuenta. Si usted no lo ha solicitado, por favor ignore este mensaje. Caducara en 1 hora.
                    <br><br>
                    <b>Para restablecer su contraseña, por favor visite el siguiente URL:</b>
                    <br><br>
                    <a href="${link}" class="form-button button">Restaurar contraseña</a>
                    <a href="${link}">${link}</a>
                    <br><br>
                    Cundo visite este enlace, tendrá la oportunidad de elegir una nueva contraseña.
                    <br><br>
                    Para cualquier duda estamos a su disposición.
                    <br><br>
                    Atentamente,
                    <br><br><br>
                    Equipo de Ecommerce
                    </p>
                    <style>
                    .button {
                        display: block;
                        width: 200px;
                        height: 22px;
                        background: rgba(255, 235, 59);;
                        padding: 10px;
                        text-align: center;
                        border-radius: 5px;
                        color: black;
                        font-weight: bold;
                        line-height: 25px;
                        text-decoration: none;
                        margin: 25px;
                    }
                    .form-button:hover,
                    .form-button:focus,
                    .form-button:active,
                    .form-button.active,
                    .form-button:active:focus,
                    .form-button:active:hover,
                    .form-button.active:hover,
                    .form-button.active:focus {
                        background-color: rgba(255, 235, 59, 0.473);
                        border-color: rgba(255, 235, 59, 0.473);
                    }
                    </style>`

                    const subject = 'Recuperación de contraseña'
                    UserService.sendMail(email, html, subject)
                    
                    res.render('error/general', {title: 'Recuperar Contrasseña', error: 'Correo enviado...'})
                    //res.send('Correo enviado...')
                    //setTimeout(res.redirect("/session/login"), 5000)
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