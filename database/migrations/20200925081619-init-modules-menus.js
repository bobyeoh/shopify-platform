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
    await queryInterface.createTable('rb_modules_menus', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      module_id: INTEGER,
      name: STRING(100),
      url: STRING(100),
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
    await queryInterface.dropTable('rb_modules_menus');
  },
};
