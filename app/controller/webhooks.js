const Controller = require('egg').Controller;

class WebhooksController extends Controller {
  // receive
  async receive() {
    const ctx = this.ctx;
    // console.log(ctx.request);
    // console.log(ctx.request.body);
    // for debug in future
    ctx.helper.success(ctx, 'xxxx');
    ctx.status = 200;
  }
}
module.exports = WebhooksController;
