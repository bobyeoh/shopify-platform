/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const API_VERSION = 'v1';
  const API_PREFIX = 'api';
  const { router, controller } = app;
  const operation = app.middleware.jwt(1);
  const admin = app.middleware.jwt(0);
  router.get('/', controller.webhooks.receive);

  router.get(`/${API_PREFIX}/${API_VERSION}/webhooks`, controller.webhooks.receive);
  router.post(`/${API_PREFIX}/${API_VERSION}/webhooks`, controller.webhooks.receive);
  router.put(`/${API_PREFIX}/${API_VERSION}/webhooks`, controller.webhooks.receive);
  router.delete(`/${API_PREFIX}/${API_VERSION}/webhooks`, controller.webhooks.receive);

  router.post(`/${API_PREFIX}/${API_VERSION}/users`, admin, controller.users.create);
  router.put(`/${API_PREFIX}/${API_VERSION}/users`, admin, controller.users.update);

  router.put(`/${API_PREFIX}/${API_VERSION}/users/set_current_store`, operation, controller.users.setCurrentStore);
  router.post(`/${API_PREFIX}/${API_VERSION}/users/login`, controller.users.login);
  router.get(`/${API_PREFIX}/${API_VERSION}/users/logout`, controller.users.logout);
  router.get(`/${API_PREFIX}/${API_VERSION}/users/get_current_user`, operation, controller.users.getCurrentUser);
  router.get(`/${API_PREFIX}/${API_VERSION}/users/list`, admin, controller.users.getList);

  router.post(`/${API_PREFIX}/${API_VERSION}/users/stores`, admin, controller.usersStores.create);
  router.put(`/${API_PREFIX}/${API_VERSION}/users/stores`, admin, controller.usersStores.update);
  router.delete(`/${API_PREFIX}/${API_VERSION}/users/stores`, admin, controller.usersStores.remove);
  router.get(`/${API_PREFIX}/${API_VERSION}/users/stores`, operation, controller.usersStores.getList);

  router.put(`/${API_PREFIX}/${API_VERSION}/users/permissions`, admin, controller.usersPermissions.update);
  router.get(`/${API_PREFIX}/${API_VERSION}/users/permissions`, operation, controller.usersPermissions.getList);
  /**
    user module
  **/
  router.get(`/${API_PREFIX}/${API_VERSION}/modules`, operation, controller.modules.getList);
  router.post(`/${API_PREFIX}/${API_VERSION}/modules`, admin, controller.modules.create);
  router.delete(`/${API_PREFIX}/${API_VERSION}/modules`, admin, controller.modules.remove);
  router.put(`/${API_PREFIX}/${API_VERSION}/modules`, admin, controller.modules.update);

  router.post(`/${API_PREFIX}/${API_VERSION}/modules/menu`, admin, controller.modules.createMenu);
  router.put(`/${API_PREFIX}/${API_VERSION}/modules/menu`, admin, controller.modules.updateMenu);
  router.delete(`/${API_PREFIX}/${API_VERSION}/modules/menu`, admin, controller.modules.removeMenu);
  /**
    system modules
  **/
  router.get(`/${API_PREFIX}/${API_VERSION}/stores`, operation, controller.stores.getList);
  router.post(`/${API_PREFIX}/${API_VERSION}/stores`, admin, controller.stores.create);
  router.delete(`/${API_PREFIX}/${API_VERSION}/stores`, admin, controller.stores.remove);
  router.put(`/${API_PREFIX}/${API_VERSION}/stores`, admin, controller.stores.update);

};
