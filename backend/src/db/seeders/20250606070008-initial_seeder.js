'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'admin',
        email: 'admin@email.test',
        password: '$2b$10$PTsa8WJ/4iqpgxn55WnP9.floFDdLSVWJYa1CH3t6YxqKbhZRboHC',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const genres = ['ficción', 'tecnología', 'historia'];
    await queryInterface.bulkInsert(
      'genres',
      genres.map((name) => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const editorials = ['planeta', 'o’reilly media', 'penguin random house'];
    await queryInterface.bulkInsert(
      'editorials',
      editorials.map((name) => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const authors = ['isabel allende', 'robert c. martin', 'yuval noah harari', 'brandon sanderson'];
    await queryInterface.bulkInsert(
      'authors',
      authors.map((name) => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    const [genresRows] = await queryInterface.sequelize.query('SELECT id FROM genres');
    const [editorialsRows] = await queryInterface.sequelize.query('SELECT id FROM editorials');
    const [authorsRows] = await queryInterface.sequelize.query('SELECT id FROM authors');

    const books = Array.from({ length: 30 }).map((_, i) => ({
      title: `libro de prueba ${i + 1}`,
      author_id: authorsRows[Math.floor(Math.random() * authorsRows.length)].id,
      editorial_id: editorialsRows[Math.floor(Math.random() * editorialsRows.length)].id,
      genre_id: genresRows[Math.floor(Math.random() * genresRows.length)].id,
      price: Math.floor(Math.random() * 100) + 10,
      availability: Math.random() > 0.3,
      image_url: 'https://placehold.co/400',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('books', books);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books', {});
    await queryInterface.bulkDelete('authors', {});
    await queryInterface.bulkDelete('editorials', {});
    await queryInterface.bulkDelete('genres', {});
    await queryInterface.bulkDelete('users', { email: 'admin@email.test' });
  }
};
