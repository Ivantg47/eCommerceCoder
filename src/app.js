import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import session from 'express-session'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import cookieParser from "cookie-parser";
import config from './config/config.js'
import router from './router/index_router.js'
import { ChatService, ProductService } from './repositories/index_repository.js'
import errorHandler from './middlewares/errors/errorHandler.js'
import logger, { addLogger } from './utils/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import  swaggerUiExpress from 'swagger-ui-express'
import { Session } from './dao/factory.js'

const app = express()

app.use(addLogger)
app.use(cookieParser(config.COOKIE_SECRET))

const  swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion ecommers",
            description: "documentacion del sitio de compras"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(session(Session))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
//app.use(cors({origin: , methods: ["PUT", "POST", "GET", "DELETE"]}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', router)
app.use(errorHandler)

const httpServer = app.listen(config.PORT, () => logger.info('Server running...'))
const io = new Server(httpServer)

app.set("io", io);

io.on('connection', async socket => {
    //console.log(`Nuevo cliente id: ${socket.id}`);
    io.sockets.emit('lista', await ProductService.getProducts())
    
    socket.on('updateList', async prod => {
        io.sockets.emit('lista', await ProductService.getProducts())
    })

    socket.on('authenticated', async user => {
        
        socket.broadcast.emit('allChat', user)
        socket.emit('messageLogs',await ChatService.getMessages())
    })

})

app.get('/loggerTest', (req, res) => {
    req.logger.fatal('FATAL ERROR')
    req.logger.error('error on DB')
    req.logger.warning('Dont worry, it\'s just warning')
    req.logger.info('Se llamo a la pagian principal')
    req.logger.http('Http message')
    req.logger.debug('1 + 1 === 2 ???')

    res.send({message: 'Logger testing!!'})
})


