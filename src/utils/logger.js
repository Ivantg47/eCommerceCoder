import winston from 'winston'
import config from '../config/config.js'
import __dirname from '../utils.js'

const customeLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "bgRed",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "grey",
    }
}
const myFormat = winston.format.printf( (info) => {
    
    //console.log('hola mes', typeof info.message, 'info: ', typeof info, 'err', info instanceof Error);
    
    if(info instanceof Error) {
       console.log("err");
        return `${info.level}: [${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] ${info.message}`;
    }

    if(typeof info.message == 'object') {
        
        info.message = JSON.stringify(info.message, null, 3)
    }
    
    let msg = `${info.level} : [${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] ${info.message}` 
    return msg
});

const devLog = winston.createLogger({
    levels: customeLevelOptions.levels,
    
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: customeLevelOptions.colors}),
                winston.format.splat(),
                //winston.format.errors({ stack: true }),
                myFormat,
            )
        }),
        new winston.transports.File({
            filename: __dirname + "/utils/logs/error.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
}) 

const prodLog = winston.createLogger({
    levels: customeLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: customeLevelOptions.colors}),
                winston.format.splat(),
                //winston.format.errors({ stack: true }),
                myFormat,
            )
        }),
        new winston.transports.File({
            filename: __dirname + "/utils/logs/error.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

const logger = config.MODE == "DEV" ? devLog : prodLog

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.debug(`${req.method} en ${req.url}`)

    next()
}

export default logger