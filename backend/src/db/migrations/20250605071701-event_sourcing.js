'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('book_events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'books', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      event_type: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE'),
        allowNull: false,
      },
      previous_state: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_state: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('editorial_events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      editorial_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'editorials', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      event_type: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE'),
        allowNull: false,
      },
      previous_state: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_state: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('author_events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'authors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      event_type: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE'),
        allowNull: false,
      },
      previous_state: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_state: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    await queryInterface.createTable('genre_events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'genres', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      event_type: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE'),
        allowNull: false,
      },
      previous_state: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_state: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('genre_events');
    await queryInterface.dropTable('author_events');
    await queryInterface.dropTable('editorial_events');
    await queryInterface.dropTable('book_events');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_book_events_event_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_editorial_events_event_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_author_events_event_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_genre_events_event_type";');
  }
};