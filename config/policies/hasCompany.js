'use strict';

/**
 * `hasCompany` policy.
 */

module.exports = async (ctx, next) => {
  if (ctx.state.user && !ctx.state.user.company) {
    return ctx.unauthorized('Você não está vinculado a nenhuma empresa');
  }

  await next();
};
