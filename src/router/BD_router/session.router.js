import express from 'express'
import passport from 'passport'
const router = express.Router()

import { userModel } from '../../dao/models/user.model.js'
import { createHash, isValidPassword } from '../../utils.js'

router.post('/create', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), async (req, res, next) => {
    try {
        
        const newUser = req.body
        //console.log(newUser);
        
        if(!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password){
            return res.status(400).render('error/general', {error: 'Todos los campos son obligatorios'})
        }
        // newUser.password = createHash(newUser.password)
        // //console.log(newUser);
        // const result = await userModel.create(newUser)
        // //console.log(result);
        res.redirect('/login')

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/faillogin'}), async (req, res) => {
    try {
        
        //console.log('no entra');
        if (!req.user) {
            return res.status(401).render('error/general', {error: 'Correo incorrecto'})
        }

        req.session.user = req.user
        
        req.session.user.rol = (req.user.email == 'adminCoder@coder.com') ? 'admin' : 'usuario'
        
        res.redirect('/product')
        //res.status(200)
            

    } catch (error) {
        console.log(error);
        //return next()
    }
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res) => {console.log('holaaa');})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    console.log('hola');
    req.session.user = req.user
    res.redirect('/product')
})

router.get('/faillogin', (req, res) => {
    res.json({error: 'Failed login'})
})

router.get('/failregister', (req, res) => {
    res.json({error: 'Failed to register'})
})

router.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if(err) return res.status(500).render('error/general', {error: err})
        })
        //return res.status(200).send('Logout success')
        res.redirect("/login");

    } catch (error) {
        console.log(error);
        return next()
    }
})

router.post('/restorPass', async (req, res, next) => {
    try {
        //console.log(req.body);
        const {email, password} = req.body
        //console.log('aa:', email, password);
        const result = await userModel.findOneAndUpdate({email: email, method: 'local'}, {'$set': {password: createHash(password)}})

        if (!result) {
            console.log('Usuario no encontrado')
            res.status(404).redirect('/restor')
        } else {
            console.log('Cambio contraseña exitoso')
            res.status(200).redirect('/login')
        }

    } catch (error) {
        console.log(error);
        return next()
    }
})

export default router