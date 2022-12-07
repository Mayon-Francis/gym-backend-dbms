import { createLogger, format, transports } from 'winston';
const withTimeAndLevel = format.combine(
    format.timestamp(),
    format.printf(info => `[${info.timestamp}][${info.level}]: ${info.message}`)
);

const logger = createLogger({
    level: 'info',
    format: withTimeAndLevel,
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(
        {
            format: format.combine(
                format.colorize(),
                withTimeAndLevel
            )
        }
    ));
}

export default logger;