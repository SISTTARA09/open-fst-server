import { config } from "dotenv";
import winston from "winston";
config();
// imports

// logger
const logger = winston.createLogger({
	level: "info",

	format: winston.format.json(),
	transports: [
		new winston.transports.File({
			filename: "./debug/errors.log",
			level: "error",
		}),
		new winston.transports.File({ filename: "./debug/comobined.log" }),
	],
});

export default logger;
