'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Admins', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            email: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            password: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            token: {
                allowNull: true,
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('Admins')
    }
}