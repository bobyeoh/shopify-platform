module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const StoresModules = app.model.define('rb_stores_modules', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    store_id: INTEGER,
    module_id: INTEGER,
  });
  StoresModules.associate = function() {
    app.model.StoresModules.belongsTo(app.model.Modules, { as: 'rb_modules', foreignKey: 'module_id' });
    app.model.StoresModules.belongsTo(app.model.Stores, { as: 'rb_stores', foreignKey: 'store_id' });
  };
  return StoresModules;
};
