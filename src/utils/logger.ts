import path from 'path';
import { createLogger, transports, format, transport } from 'winston';

const formatLog = (log: any): string => {
    if (log.module)
        return `${log.label} ${`[\x1b[35m${log.module}\x1b[0m]`} [${log.level}]: ${log.message}`;
    return `${log.label} [${log.level}]: ${log.message}`;
}

const retriveLogPath = () => `${path.join(__dirname, "../../info.log")}`
export const logger = createLogger({
    silent: false,
    transports: [
        new transports.File({
            filename: retriveLogPath(),
            level: "silly",
            format: format.combine(format.errors({stack: true}), format.timestamp(), format.json())
        }),
        new transports.Console({
            level: "debug",
            format: format.combine(
                format.label({ label: "[SERVER]:"}),
                format.colorize({ all: true}),
                format.printf(formatLog)
            )
        })
    ]
})

export default logger;