'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'books',
      'image_url',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'image_url');
  }
};