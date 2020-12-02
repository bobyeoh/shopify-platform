const Controller = require('egg').Controller;

class UsersPermissionsController extends Controller {
  // create stores
  async update() {
    const ctx = this.ctx;
    const createRule = {
      user_id: { type: 'int', required: true, allowEmpty: false },
      store_id: { type: 'int', required: true, allowEmpty: false },
      permissions: { type: 'array', itemType: 'object', rule: {
        module_id: 'int',
        menu_id: 'int',
      }, required: true },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { user_id, store_id, permissions } = ctx.request.body;
    const records = permissions.map(permission => {
      return {
        user_id,
        store_id,
        module_id: permission.module_id,
        menu_id: permission.menu_id,
      };
    });
    await ctx.model.UsersPermissions.destroy({
      where: {
        user_id,
        store_id,
      },
    });
    const id = await ctx.model.UsersPermissions.bulkCreate(records);
    ctx.helper.success(ctx, {
      id,
    });
    ctx.status = 201;
  }
  // getlist
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
    const data = await ctx.model.UsersPermissions.findAll({ where: { user_id } });
    return ctx.helper.success(ctx, data);
  }
}
module.exports = UsersPermissionsController;
