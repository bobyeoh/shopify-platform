const Controller = require('egg').Controller;

class StoresController extends Controller {
  // create store
  async create() {
    const ctx = this.ctx;
    const createRule = {
      name: { type: 'string', required: true, allowEmpty: false },
      key: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'string', required: true, allowEmpty: false },
      secret: { type: 'string', required: true, allowEmpty: false },
      url: { type: 'string', required: true, allowEmpty: false },
      modules: { type: 'array', itemType: 'int', allowEmpty: true },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { name, key, password, secret, url, modules } = ctx.request.body;
    const result = await ctx.model.Stores.create({ name, key, password, secret, url });
    const modulesCreation = modules.map(module => ({ store_id: result.id, module_id: module }));
    await ctx.model.StoresModules.bulkCreate(modulesCreation);
    ctx.helper.success(ctx, {
      result,
    });
    ctx.status = 201;
  }
  // update store
  async update() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
      name: { type: 'string', required: true, allowEmpty: false },
      key: { type: 'string', required: true, allowEmpty: true },
      password: { type: 'string', required: true, allowEmpty: true },
      secret: { type: 'string', required: true, allowEmpty: true },
      url: { type: 'string', required: true, allowEmpty: true },
      modules: { type: 'array', itemType: 'int', allowEmpty: true },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { id, name, key, password, secret, url, modules } = ctx.request.body;
    const store = await ctx.model.Stores.findByPk(id);
    store.name = name;
    store.key = key;
    store.password = password;
    store.secret = secret;
    store.url = url;
    await store.save();
    const modulesCreation = modules.map(module => ({ store_id: id, module_id: module }));
    await ctx.model.StoresModules.destroy({ where: { store_id: id } });
    await ctx.model.StoresModules.bulkCreate(modulesCreation);
    ctx.helper.success(ctx, { store });
    ctx.status = 201;
  }
  // remove store
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
    await ctx.model.Stores.destroy({ where: { id } });
    await ctx.model.StoresModules.destroy({ where: { store_id: id } });
    await ctx.model.UsersStores.destroy({ where: { store_id: id } });
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
    let data = await ctx.model.Stores.findAll({ where });
    data = data.map(v => v.get({ plain: true }));
    for (let i = 0; i < data.length; i++) {
      const modules = await ctx.model.StoresModules.findAll({ where: { store_id: data[i].id } });
      data[i].modules = modules.map(module => (module.module_id));
    }
    return ctx.helper.success(ctx, data);
  }
}
module.exports = StoresController;
