'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            email: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            iin: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            phone: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            password: {
                allowNull: false,
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
        await queryInterface.dropTable('Users')
    }
}