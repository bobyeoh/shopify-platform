
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const UsersTokens = app.model.define('rb_users_tokens', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: INTEGER,
    token: STRING(36),
    ip: STRING(100),
    expired_at: DATE,
  }, {
    indexes: [{
      unique: true,
      fields: [ 'token' ],
    }],
  });
  UsersTokens.associate = function() {
    UsersTokens.belongsTo(app.model.Users, { as: 'rb_users', foreignKey: 'user_id' });
  };
  return UsersTokens;
};
