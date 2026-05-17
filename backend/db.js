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
const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);
const connectionLimit = isTestEnv ? 1 : Number(process.env.DB_CONNECTION_LIMIT) || 10;
const retryableDbErrors = new Set(["ER_USER_LIMIT_REACHED", "ER_CON_COUNT_ERROR"]);

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port,
  waitForConnections: true,
  connectionLimit,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ssl: sslEnabled
    ? {
        rejectUnauthorized
      }
    : undefined
});

const promisePool = pool.promise();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (operation) => {
  const maxAttempts = isTestEnv ? 5 : 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const canRetry = retryableDbErrors.has(error?.code) && attempt < maxAttempts;
      if (!canRetry) {
        throw error;
      }

      await wait(150 * attempt);
    }
  }

  throw new Error("Falha inesperada ao executar operacao no banco");
};

module.exports = {
  execute: (sql, values) => withRetry(() => promisePool.execute(sql, values)),
  query: (sql, values) => withRetry(() => promisePool.query(sql, values)),
  end: () => promisePool.end(),
};
