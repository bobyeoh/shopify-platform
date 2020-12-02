'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    const { STRING, INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('rb_users_tokens', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: INTEGER,
      token: STRING(100),
      ip: STRING(100),
      expired_at: DATE,
      created_at: DATE,
      updated_at: DATE,
    }, {
      indexes: [{
        unique: true,
        fields: [ 'token' ],
      }],
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('rb_users_tokens');
  },
};