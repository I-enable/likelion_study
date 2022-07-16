const { Sequelize } = require("sequelize");
const User = require("./user");  // 1
const General = require("./general");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize( //config의 db정보와 연결
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;  // 2
db.General = General;

User.init(sequelize);  // 3
General.init(sequelize);

User.associate(db);  // 4
General.associate(db);

module.exports = db;
