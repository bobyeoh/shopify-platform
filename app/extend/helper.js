// success
exports.success = (ctx, result = null, message = 'success') => {
  ctx.body = {
    code: 'success',
    message,
    data: result,
  };
};

// error
exports.error = (ctx, code, message, errors) => {
  ctx.body = {
    code,
    message,
    errors,
  };
  ctx.status = 422;
};

exports.error_code = {
  email_exists: 'Email address already exists.',
  login_failed: 'The email or password is incorrect.',
  permission_denied: 'Permission denied.',
  store_exists: 'The store already exists.',
};

exports.roles = {
  USER: 1,
  ADMIN: 0,
};


// get ip
exports.getIp = ctx => {
  return ctx.request.ip.replace(/::ffff:/, '');
};
