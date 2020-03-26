const validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateLoginInput(data) {
  const errors = {};

  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';

  if (!validator.isEmail(data.email)) {
    errors.email = 'This is an invalid e-mail!'
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "E-mail can't be empty!"
  }

  if (!validator.isEmail(data.password)) {
    errors.password = "Password can't be empty!"
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};