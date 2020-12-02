module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const Modules = app.model.define('rb_modules', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(100),
    version: STRING(100),
    icon: STRING(100),
    permission: INTEGER,
  });
  return Modules;
};
