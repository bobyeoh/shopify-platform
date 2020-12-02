
module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const UsersStores = app.model.define('rb_users_stores', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: INTEGER,
    store_id: INTEGER,
    owner: INTEGER,
  });
  UsersStores.associate = function() {
    app.model.UsersStores.belongsTo(app.model.Stores, { as: 'rb_stores', foreignKey: 'store_id' });
    app.model.UsersStores.belongsTo(app.model.Users, { as: 'rb_users', foreignKey: 'user_id' });
  };
  return UsersStores;
};
