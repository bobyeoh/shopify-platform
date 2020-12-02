const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Controller = require('egg').Controller;

class UsersController extends Controller {
  // create user
  async create() {
    const ctx = this.ctx;
    const createRule = {
      name: { type: 'string', required: true, allowEmpty: false },
      email: { type: 'email', required: true, allowEmpty: false },
      password: { type: 'password', required: true, allowEmpty: false, min: 6 },
      role: { type: 'enum', values: [ 0, 1 ] },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const user = await ctx.model.Users.findOne({ where: { email: ctx.request.body.email } });
    if (user) {
      return ctx.helper.error(ctx, 'email_exists', ctx.helper.error_code.email_exists, null);
    }
    const { name, email, role } = ctx.request.body;
    const avatar = '';
    const store_id = 0;
    let password = ctx.request.body.password;
    password = crypto.createHash('md5').update(`RB+${password}+RB`).digest('hex');
    const id = await ctx.model.Users.create({ name, email, password, role, avatar, store_id });
    ctx.helper.success(ctx, {
      user_id: id,
    });
    ctx.status = 201;
  }
  // update user
  async update() {
    const ctx = this.ctx;
    const createRule = {
      id: { type: 'int', required: true, allowEmpty: false },
      name: { type: 'string', required: true, allowEmpty: false },
      email: { type: 'email', required: true, allowEmpty: false },
      password: { type: 'password', required: false, allowEmpty: true, min: 6 },
      role: { type: 'enum', values: [ 0, 1 ] },
    };
    try {
      ctx.validate(createRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    const { id, name, email, role, password } = ctx.request.body;
    const user = await ctx.model.Users.findByPk(id);
    const validate_user = await ctx.model.Users.findOne({ where: { email } });

    if (validate_user && user.email !== email) {
      return ctx.helper.error(ctx, 'email_exists', ctx.helper.error_code.email_exists, null);
    }
    user.name = name;
    user.email = email;
    if (password) {
      user.password = crypto.createHash('md5').update(`RB+${password}+RB`).digest('hex');
    }
    user.role = role;
    await user.save();
    ctx.helper.success(ctx, user);
    ctx.status = 201;
  }
  // set current store
  async setCurrentStore() {
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
    const user = await ctx.model.Users.findByPk(ctx.user.id);
    user.store_id = id;
    await user.save();
    ctx.helper.success(ctx, null);
    ctx.status = 201;
  }
  // login
  async login() {
    const ctx = this.ctx;
    const token = uuidv4();
    const ip = ctx.helper.getIp(ctx);
    const email = ctx.request.body.email;
    const expire_time = 1000 * 60 * 60 * 24 * 15;
    const loginRule = {
      email: { type: 'email', required: true, allowEmpty: false },
      password: { type: 'password', required: true, allowEmpty: false, min: 6 },
    };
    try {
      ctx.validate(loginRule, ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, err.code, err.message, err.errors);
    }
    let password = ctx.request.body.password;
    password = crypto.createHash('md5').update(`RB+${password}+RB`).digest('hex');
    const user = await ctx.model.Users.findOne({ where: { email } });
    if (user && user.password === password) {
      const token_obj = {
        user_id: user.id,
        expired_at: Date.now() + expire_time,
        token,
        ip,
      };
      const cookie_options = {
        httpOnly: true,
        signed: true,
        encrypt: true,
        maxAge: expire_time,
      };
      await ctx.model.UsersToken.create(token_obj);
      ctx.cookies.set('u', token_obj.token, cookie_options);
      return ctx.helper.success(ctx, null);
    }
    return ctx.helper.error(ctx, 'login_failed', ctx.helper.error_code.login_failed, null);
  }
  // get current user
  async getCurrentUser() {
    const ctx = this.ctx;
    const Op = ctx.app.Sequelize.Op;
    if (!ctx.user) {
      return ctx.helper.error(ctx, 'authentication_failed', ctx.helper.error_code.authentication_failed, null);
    }
    ctx.user.permissions = ctx.permissions;
    const store_ids = ctx.stores.map(store => store.store_id);
    let stores = await ctx.model.Stores.findAll({ where: { id: { [Op.or]: store_ids } } });
    stores = stores.map(store => store.get({ plain: true }));
    stores.forEach(store=>{
      ctx.stores.forEach(user_store => {
        if (user_store.store_id === store.id) {
          store.owner = user_store.owner;
        }
      });
    });
    ctx.user.stores = stores;
    return ctx.helper.success(ctx, ctx.user);
  }
  // get list
  async getList() {
    const ctx = this.ctx;
    let { email, page, size } = ctx.request.query;
    page = Number(page) ? Number(page) : 1;
    size = Number(size) ? Number(size) : 10;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * size;
    let data = [];
    let count = 0;
    if (email) {
      data = await ctx.model.Users.findAndCountAll({ where: { email }, limit: size, offset });
      count = await ctx.model.Users.count({ where: { email } });
    } else {
      data = await ctx.model.Users.findAndCountAll({ limit: size, offset });
      count = await ctx.model.Users.count({ });
    }
    data = data.rows.map(row => row.get({ plain: true }));
    for (let i = 0; i < data.length; i++) {
      let stores = await ctx.model.UsersStores.findAll({ where: { user_id: data[i].id } });
      stores = JSON.parse(JSON.stringify(stores));
      data[i].password = '';
      data[i].stores = stores;
    }
    return ctx.helper.success(ctx, { data, count });
  }
  // logout
  async logout() {
    const ctx = this.ctx;
    const u = ctx.cookies.get('u', {
      signed: true,
      encrypt: true,
    });
    const cookie_options = {
      httpOnly: true,
      signed: true,
      encrypt: true,
      maxAge: -1,
    };
    await ctx.model.UsersToken.destroy({
      where: {
        token: u,
      },
    });
    ctx.cookies.set('u', null, cookie_options);
    return ctx.helper.success(ctx, null);
  }
}
module.exports = UsersController;
