module.exports = async () => {
  const db = require("../backend/db");

  try {
    await db.end();
  } catch (error) {
    if (error && error.code !== "POOL_CLOSED") {
      throw error;
    }
  }
};
