"use strict";

let envPath;
switch (process.env.NODE_ENV) {
	case "test":
		envPath = `${__dirname}/.env.test`;
		break;
	case "production":
		envPath = `${__dirname}/.env.production`;
		break;
	default:
		envPath = `${__dirname}/.env.development`;
}
require("dotenv").config({ path: envPath });
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize
	.authenticate()
	.then(() => {
		console.log(`Db connect to \x1b[33m${config.database}\x1b[0m at host \x1b[35m${config.host}`);
		console.log("\x1b[37;42mConnection has been established successfully.\x1b[0m");
	})
	.catch((e) => {
		console.error(`\x1b[41mUnable to connect to the database: ${e}\x1b[0m`);
	});

fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file.indexOf(".test.js") === -1
		);
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
