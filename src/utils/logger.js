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
        return `${info.level}: ${info.message}`;
    }

    if(typeof info.message == 'object') {
        
        info.message = JSON.stringify(info.message, null, 3)
    }
    
    let msg = `${info.level} : ${info.message} ` 
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
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()
}

export default logger

// const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)

// const logger = winston.createLogger({
//   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//   format: format.combine(
//     format.label({ label: path.basename(process.mainModule.filename) }),
//     format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     // Format the metadata object
//     format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
//   ),
//   transports: [
//     new transports.Console({
//       format: format.combine(
//         format.colorize(),
//         logFormat
//       )
//     }),
//     new transports.File({
//       filename: 'logs/combined.log',
//       format: format.combine(
//         // Render in one line in your log file.
//         // If you use prettyPrint() here it will be really
//         // difficult to exploit your logs files afterwards.
//         format.json()
//       )
//     })
//   ],
//   exitOnError: false
// })