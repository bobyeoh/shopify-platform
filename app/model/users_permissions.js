
module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const UsersPermissions = app.model.define('rb_users_permissions', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: INTEGER,
    store_id: INTEGER,
    module_id: INTEGER,
    menu_id: INTEGER,
  });
  UsersPermissions.associate = function() {
    app.model.UsersPermissions.belongsTo(app.model.Modules, { as: 'rb_modules', foreignKey: 'module_id' });
    app.model.UsersPermissions.belongsTo(app.model.Stores, { as: 'rb_stores', foreignKey: 'store_id' });
    app.model.UsersPermissions.belongsTo(app.model.ModulesMenus, { as: 'rb_modules_menus', foreignKey: 'menu_id' });
    app.model.UsersPermissions.belongsTo(app.model.Users, { as: 'rb_users', foreignKey: 'user_id' });
  };
  return UsersPermissions;
};
