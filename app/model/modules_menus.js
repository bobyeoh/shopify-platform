module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const ModulesMenus = app.model.define('rb_modules_menus', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    module_id: INTEGER,
    name: STRING(100),
    url: STRING(100),
  });
  ModulesMenus.associate = function() {
    app.model.ModulesMenus.belongsTo(app.model.Modules, { as: 'rb_modules', foreignKey: 'module_id' });
  };
  return ModulesMenus;
};
