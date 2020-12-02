const Controller = require('egg').Controller;

class UsersStoresController extends Controller {
  // create stores
  async create() {
    const ctx = this.ctx;
    const createRule = {
      user_id: { type: 'int', required: true, allowEmpty: false },
      store_id: { type: 'int', required: true, allowEmpty: false },
      owner: { type: 'enum', values: [ 0, 1 ] },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { user_id, store_id, owner } = ctx.request.body;
    const store = await ctx.model.UsersStores.findOne({ where: { user_id, store_id } });
    if (store) {
      return ctx.helper.error(ctx, 'store_exists', ctx.helper.error_code.store_exists, null);
    }
    const result = await ctx.model.UsersStores.create({ user_id, store_id, owner });
    ctx.helper.success(ctx, {
      result,
    });
    ctx.status = 201;
  }
  // update stores
  async update() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
      owner: { type: 'enum', values: [ 0, 1 ] },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { owner, id } = ctx.request.body;
    const store = await ctx.model.UsersStores.findByPk(id);
    store.owner = owner;
    await store.save();
    ctx.helper.success(ctx, store);
    ctx.status = 201;
  }
  // remove stores
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
    await ctx.model.UsersStores.destroy({ where: { id } });
    ctx.helper.success(ctx, null);
    ctx.status = 201;
  }
  // get list
  async getList() {
    const ctx = this.ctx;
    const rule = {
      user_id: { type: 'int', required: true, allowEmpty: false },
    };
    try {
      ctx.request.query.user_id = Number(ctx.request.query.user_id);
      ctx.validate(rule, ctx.request.query);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const user_id = ctx.request.query.user_id;
    const data = await ctx.model.UsersStores.findAll({ where: { user_id } });
    return ctx.helper.success(ctx, data);
  }
}
module.exports = UsersStoresController;
