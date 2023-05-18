import config from "../config/config.js";
import mongoose from "mongoose";
import FileStore from "session-file-store"
import MongoStore from 'connect-mongo'
import session from 'express-session'
import __dirname from "../utils.js";
import logger from "../utils/logger.js";

export let Products
export let Carts
export let Chat
export let Session
export let User
export let Ticket

switch (config.PERCISTRENCE) {

    case 'MONGO':
        logger.info('Mongo connect');
        
        mongoose.set('strictQuery', false)
        mongoose.connect(config.MONGO_URL, {dbname: config.BD_NAME,
        autoIndex: true},  error => {
            if (error) {
                console.error('No connect', error);
                process.exit()
            }
        })


        const { default: ProductsMongo } = await import('./bd_manager/mogo/product_mongoManager.js')
        const { default: CartsMongo } = await import('./bd_manager/mogo/cart_mongoManager.js')
        const { default: ChatMongo } = await import('./bd_manager/mogo/chat_mongoManager.js')
        const { default: UserMongo } = await import('./bd_manager/mogo/user_mongoManager.js')
        const { default: TicketMongo } = await import('./bd_manager/mogo/ticket_mongoManager.js')

        Session = {
            secret: config.SESSION_SECRET,
            store: MongoStore.create({
                mongoUrl: config.MONGO_URL,
                dbName: config.BD_NAME,
                mongoOptions: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                ttl: 100
            }),
            resave: false,
            saveUninitialized: false
        }

        Products = ProductsMongo
        Carts = CartsMongo
        Chat = ChatMongo
        User = UserMongo
        Ticket = TicketMongo
        
        break;

    case 'FILE':
        logger.info('File percistance');
        const fileStore = FileStore(session)
        const { default: ProductsFile } = await import('./file_manager/product_fileManager.js')
        const { default: CartsFile } = await import('./file_manager/cart_fileManager.js')
        const { default: ChatFile } = await import('./file_manager/chat_fileManager.js')
        const { default: UserFile } = await import('./file_manager/user_fileManage.js')
        const { default: TicketFile } = await import('./file_manager/ticket_fileManager.js')

        Session = {
            secret: config.SESSION_SECRET,
            store: new fileStore({path: __dirname + '/json/sessions.json', ttl:100, retries:0}),
            resave: false,
            saveUninitialized: false
        }

        Products = ProductsFile
        Carts = CartsFile
        Chat = ChatFile
        User = UserFile
        Ticket = TicketFile

        break;
    default:
        logger.info('Memory percistance');

        Session = {
            secret: config.SESSION_SECRET,
            resave: true,
            saveUninitialized: true
        }

        const { default: ProductsMemory } = await import('./memory_manager/product_memoryManager.js')
        const { default: CartsMemory } = await import('./memory_manager/cart_memoryManager.js')
        const { default: ChatMemory } = await import('./memory_manager/chat_memoryManager.js')
        const { default: UserMemory } = await import('./memory_manager/user_memoryManage.js')
        const { default: TicketMemory } = await import('./memory_manager/ticket_memoryManager.js')

        Products = ProductsMemory
        Carts = CartsMemory
        Chat = ChatMemory
        User = UserMemory
        Ticket = TicketMemory

        break;
}