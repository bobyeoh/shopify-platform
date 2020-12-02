
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const Users = app.model.define('rb_users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(100),
    email: STRING(100),
    avatar: STRING(100),
    password: STRING(32),
    store_id: INTEGER,
    role: INTEGER,
  }, {
    indexes: [{
      unique: true,
      fields: [ 'email' ],
    }],
  });
  return Users;
};
