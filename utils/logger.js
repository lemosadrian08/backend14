const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'verbose'
    }),
    new winston.transports.File({
      level: 'warn',
      filename: 'warn.log'
    }),
    new winston.transports.File({
        level: 'error',
        filename: 'error.log'
    })
  ],
  format: winston.format.combine(
    winston.format.colorize({ all: true}),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} [${info.level}] => ${info.message}`)
  )
})

module.exports = logger;