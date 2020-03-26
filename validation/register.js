const validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  data.handle = validText(data.handle) ? data.handle : '';
  data.email = validText(data.email) ? data.email : '';
  data.password = validText(data.password) ? data.password : '';
  data.password2 = validText(data.password2) ? data.password2 : '';

  if (!validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = 'Handle must be between 2 and 30 characters!'
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'E-mail is invalid!'
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "E-mail can't be empty!"
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password can't be empty!"
  }

  if (!validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters!"
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Please confirm your password!'
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match!'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }

}