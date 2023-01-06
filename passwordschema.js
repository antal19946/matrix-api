const passwordValidator = require('password-validator');
const  {passwordStrength}  = require('check-password-strength')

const schema = new passwordValidator().is().min(3).max(5).uppercase().lowercase().digits(2).not().spaces()
console.log(schema.validate('1jfAa'))
console.log("======================================")
console.log(passwordStrength('AAA@20!!!!20fgfd').value)