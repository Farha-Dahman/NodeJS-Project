import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

export default logger;
