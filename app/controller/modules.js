const Controller = require('egg').Controller;

class ModulesController extends Controller {
  // create module
  async create() {
    const ctx = this.ctx;
    const createRule = {
      name: { type: 'string', required: true, allowEmpty: false },
      version: { type: 'string', required: true, allowEmpty: true },
      permission: { type: 'int', required: true, allowEmpty: true },
      icon: { type: 'string', required: true, allowEmpty: true },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { name, version, permission, icon } = ctx.request.body;
    const id = await ctx.model.Modules.create({ name, version, icon, permission });
    ctx.helper.success(ctx, {
      id,
    });
    ctx.status = 201;
  }
  // update module
  async update() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
      name: { type: 'string', required: true, allowEmpty: false },
      version: { type: 'string', required: true, allowEmpty: true },
      permission: { type: 'int', required: true, allowEmpty: true },
      icon: { type: 'string', required: true, allowEmpty: true },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { id, name, version, permission, icon } = ctx.request.body;
    const module = await ctx.model.Modules.findByPk(id);
    module.name = name;
    module.version = version;
    module.permission = permission;
    module.icon = icon;
    await module.save();
    ctx.helper.success(ctx, { module });
    ctx.status = 201;
  }
  // remove module
  async remove() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { id } = ctx.request.body;
    await ctx.model.Modules.destroy({ where: { id } });
    await ctx.model.ModulesMenus.destroy({ where: { module_id: id } });
    await ctx.model.UsersPermissions.destroy({ where: { module_id: id } });
    await ctx.model.StoresModules.destroy({ where: { module_id: id } });
    ctx.helper.success(ctx, null);
    ctx.status = 201;
  }
  // create module menu
  async createMenu() {
    const ctx = this.ctx;
    const createRule = {
      module_id: { type: 'int', required: true, allowEmpty: false },
      name: { type: 'string', required: true, allowEmpty: false },
      url: { type: 'string', required: true, allowEmpty: false },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { module_id, name, url } = ctx.request.body;
    const id = await ctx.model.ModulesMenus.create({ module_id, name, url });
    ctx.helper.success(ctx, {
      id,
    });
    ctx.status = 201;
  }
  // update module menu
  async updateMenu() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
      name: { type: 'string', required: true, allowEmpty: false },
      url: { type: 'string', required: true, allowEmpty: false },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { id, name, url } = ctx.request.body;
    const menu = await ctx.model.ModulesMenus.findByPk(id);
    menu.name = name;
    menu.url = url;
    await menu.save();
    ctx.helper.success(ctx, menu);
    ctx.status = 201;
  }
  // remove module
  async removeMenu() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { id } = ctx.request.body;
    await ctx.model.ModulesMenus.destroy({ where: { id } });
    await ctx.model.UsersPermissions.destroy({ where: { menu_id: id } });
    ctx.helper.success(ctx, null);
    ctx.status = 201;
  }
  // get list
  async getList() {
    const ctx = this.ctx;
    const where = {};
    if (ctx.user.role === 1) {
      where.role = 1;
    }
    let data = await ctx.model.Modules.findAll({ where });
    data = data.map(v => v.get({ plain: true }));
    for (let i = 0; i < data.length; i++) {
      const menus = await ctx.model.ModulesMenus.findAll({ where: { module_id: data[i].id } });
      data[i].menus = menus.map(menu => menu.get({ plain: true }));
    }
    return ctx.helper.success(ctx, data);
  }
}
module.exports = ModulesController;
