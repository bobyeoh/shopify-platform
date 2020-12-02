module.exports = role => {
  return async (ctx, next) => {
    const Op = ctx.app.Sequelize.Op;
    const u = ctx.cookies.get('u', {
      signed: true,
      encrypt: true,
    });
    const now = new Date();
    if (!u) {
      return ctx.helper.error(ctx, 'authentication_failed', ctx.helper.error_code.authentication_failed, null);
    }
    const token = await ctx.model.UsersToken.findOne({ where: { token: u } });
    if (!token) {
      return ctx.helper.error(ctx, 'authentication_failed', ctx.helper.error_code.authentication_failed, null);
    }
    ctx.token = token.get({ plain: true });
    if (ctx.token.expired_at.getTime() < now.getTime()) {
      return ctx.helper.error(ctx, 'authentication_failed', ctx.helper.error_code.authentication_failed, null);
    }
    ctx.user = await ctx.model.Users.findOne({ where: { id: ctx.token.user_id } });
    ctx.user = ctx.user.get({ plain: true });
    if (role === ctx.helper.roles.ADMIN && ctx.user.role !== ctx.helper.roles.ADMIN) {
      return ctx.helper.error(ctx, 'permission_denied', ctx.helper.error_code.permission_denied, null);
    }
    const storesWhere = {};
    if (ctx.user.role === ctx.helper.roles.USER) {
      storesWhere.user_id = ctx.token.user_id;
    }
    ctx.stores = await ctx.model.UsersStores.findAll({ where: storesWhere });
    ctx.stores = ctx.stores.map(store => store.get({ plain: true }));
    ctx.permissions = await ctx.model.UsersPermissions.findAll({ where: { user_id: ctx.token.user_id } });
    ctx.permissions = ctx.permissions.map(permission => permission.get({ plain: true }));
    let permissions = [];
    const module_ids = [];
    const menu_ids = [];
    if (ctx.user.role === ctx.helper.roles.ADMIN) {
      const where = {};
      where.permission = ctx.helper.roles.ADMIN;
      permissions = await ctx.model.Modules.findAll({ where });
      permissions = permissions.map(permission => permission.get({ plain: true }));
      for (let i = 0; i < permissions.length; i++) {
        const menus = await ctx.model.ModulesMenus.findAll({ where: { module_id: permissions[i].id } });
        permissions[i].menus = menus.map(menu => menu.get({ plain: true }));
      }
      let storesModules = await ctx.model.StoresModules.findAll({ });
      let modulesMenus = await ctx.model.ModulesMenus.findAll({ });
      storesModules = storesModules.map(module => module.get({ plain: true }));
      modulesMenus = modulesMenus.map(menu => menu.get({ plain: true }));
      storesModules.forEach(storesModule => {
        if (storesModule.store_id === ctx.user.store_id) {
          module_ids.push(storesModule.module_id);
          modulesMenus.forEach(modulesMenu => {
            if (modulesMenu.module_id === storesModule.module_id) {
              menu_ids.push(modulesMenu.id);
            }
          });
        }
      });
    } else if (ctx.user.role === ctx.helper.roles.USER) {
      ctx.permissions.forEach(module => {
        if (module.store_id === ctx.user.store_id) {
          module_ids.push(module.module_id);
          menu_ids.push(module.menu_id);
        }
      });
    }
    if (module_ids.length && menu_ids.length) {
      const where = { id: { [Op.or]: module_ids } };
      where.permission = ctx.helper.roles.USER;
      let operationPermissions = await ctx.model.Modules.findAll({ where });
      operationPermissions = operationPermissions.map(permission => permission.get({ plain: true }));
      for (let i = 0; i < operationPermissions.length; i++) {
        const menus = await ctx.model.ModulesMenus.findAll({ where: {
          module_id: operationPermissions[i].id,
          id: { [Op.or]: menu_ids },
        } });
        operationPermissions[i].menus = menus.map(menu => menu.get({ plain: true }));
      }
      permissions = permissions.concat(operationPermissions);
    }
    ctx.permissions = permissions;
    delete ctx.user.password;
    await next();
  };
};