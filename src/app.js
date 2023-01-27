import express from 'express'
import dotenv from 'dotenv'
// import prodR from './router/file_router/product.router.js'
// import cartR from './router/file_router/cart.router.js'
import prodR from './router/BD_router/product.routerBD.js'
import cartR from './router/BD_router/cart.routerBD.js'
import chatR from './router/BD_router/chat.router.js'
import sessionR from './router/BD_router/session.router.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.router.js'
import mongoose from 'mongoose'
import producto from './dao/bd_manager/productManagerBD.js'
import { mensajes } from './dao/bd_manager/chatManagerBD.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initializePassport from './config/passport.config.js'

dotenv.config()
const app = express()

const BD = {dbname: process.env.BD_NAME}

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL, BD,  error => {
    if (error) {
        console.error('No connect', error);
        process.exit()
    }
})

app.use(session({
    secret: 'hola',
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        dbName: process.env.BD_NAME,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

function auth(req, res, next){
    if(req.session?.user) return next()
    return res.status(401).send('Auth Error')
}

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/api/product', prodR)
app.use('/api/carts', auth, cartR)
app.use('/api/session', sessionR)
app.use('/api/chat', chatR)
app.use('/', viewsRouter)

const httpServer = app.listen(process.env.DEV_PORT, () => console.log('Server running...'))
const io = new Server(httpServer)

app.set("io", io);

io.on('connection', async socket => {
    console.log(`Nuevo cliente id: ${socket.id}`);

    io.sockets.emit('lista', await producto.getProducts({},{}))
    
    socket.on('updateList', async prod => {
        io.sockets.emit('lista', await producto.getProducts({},{}))
    })

    socket.on('authenticated', async user => {
        socket.broadcast.emit('allChat', user)
        //console.log(await mensajes.getMessages());
        socket.emit('messageLogs',await mensajes.getMessages())
    })

})


