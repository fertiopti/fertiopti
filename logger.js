const winston = require("winston");
const moment = require("moment-timezone");

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || "info",
    // Your Winston configuration here
    format: winston.format.combine(
        winston.format.colorize({
            all: true,
        }),
        winston.format.label({
            label: "[LOGGER]",
        }),
        winston.format.timestamp({
            format: () =>
                moment().tz("Asia/Kolkata").format("YY-MM-DD HH:mm:ss"),
        }),
        winston.format.printf(
            (info) =>
                ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
        )
    ),

    transports: [
        new winston.transports.Console(),
        // Add more transports if needed
    ],
});

// Ensure that the 'warn' and 'error' methods are available
logger.warn = logger.warn || logger.warning;
logger.error = logger.error || logger.err;

module.exports = logger;
