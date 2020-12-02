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
    await queryInterface.createTable('rb_users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(100),
      email: STRING(100),
      avatar: STRING(100),
      password: STRING(32),
      store_id: INTEGER,
      role: INTEGER,
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('rb_users');
  },
};
