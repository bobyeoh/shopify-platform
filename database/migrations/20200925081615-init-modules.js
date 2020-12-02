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
    await queryInterface.createTable('rb_modules', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: STRING(100),
      version: STRING(100),
      icon: STRING(100),
      permission: INTEGER,
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('rb_modules');
  },
};
