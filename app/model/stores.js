module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const Stores = app.model.define('rb_stores', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(100),
    key: STRING(100),
    password: STRING(100),
    secret: STRING(100),
    url: STRING(100),
  });
  return Stores;
};
