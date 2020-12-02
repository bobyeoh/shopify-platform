'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('rb_stores_modules', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      store_id: INTEGER,
      module_id: INTEGER,
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
    await queryInterface.dropTable('rb_stores_modules');
  },
};
