class AppError extends Error {
  constructor(message, status = 500, code = "APP_ERROR") {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

module.exports = AppError;
