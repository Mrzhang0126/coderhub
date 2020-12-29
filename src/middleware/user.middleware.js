const userService = require('../service/user.service');
const errorTypes = require('../constants/error-type');
const { md5password } = require('../utils/password-handle');

const verifyUser = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  if(!username || !password) {
    const err = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', err, ctx);
  }
  
  const result = await userService.getUserByName(username);
  if(result.length) {
    const err = new Error(errorTypes.USER_ALREADY_EXISTS);
    return ctx.app.emit('error', err, ctx);
  }

  await next();
}

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);
  await next();
}

module.exports = {
  verifyUser,
  handlePassword
}