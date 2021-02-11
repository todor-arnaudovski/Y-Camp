class ExpressError extends Error {
  constructor(message, statusCode) {
    super(); // calls the error constructor
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;