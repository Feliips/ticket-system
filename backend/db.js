require("dotenv").config();
const mysql = require("mysql2");

const getEnv = (...keys) => {
  for (const key of keys) {
    if (process.env[key] !== undefined && process.env[key] !== "") {
      return process.env[key];
    }
  }

  return undefined;
};

const host = getEnv("DB_HOST", "MYSQL_ADDON_HOST");
const user = getEnv("DB_USER", "MYSQL_ADDON_USER");
const password = getEnv("DB_PASSWORD", "MYSQL_ADDON_PASSWORD");
const database = getEnv("DB_NAME", "MYSQL_ADDON_DB");
const port = Number(getEnv("DB_PORT", "MYSQL_ADDON_PORT")) || 3306;

const missingVars = [];
if (!host) missingVars.push("DB_HOST/MYSQL_ADDON_HOST");
if (!user) missingVars.push("DB_USER/MYSQL_ADDON_USER");
if (!password) missingVars.push("DB_PASSWORD/MYSQL_ADDON_PASSWORD");
if (!database) missingVars.push("DB_NAME/MYSQL_ADDON_DB");

if (missingVars.length > 0) {
  throw new Error(
    `Variaveis de ambiente do banco ausentes: ${missingVars.join(", ")}`
  );
}

const sslEnabled = getEnv("DB_SSL", "MYSQL_ADDON_SSL") === "true";
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ssl: sslEnabled
    ? {
        rejectUnauthorized
      }
    : undefined
});

module.exports = pool.promise();
