'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      title: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      adminID: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: { model: 'Admins', key: 'id' },
        onDelete: 'CASCADE'
      },
      scammerID: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: 'Scammers', key: 'id' },
        onDelete: 'CASCADE'
      },
      userID: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      anonymously: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Reviews')
  }
}