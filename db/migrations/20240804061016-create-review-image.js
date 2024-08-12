'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ReviewImages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            reviewID: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: { model: 'Reviews', key: 'id' },
                onDelete: 'CASCADE'
            },
            image: {
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
        await queryInterface.dropTable('ReviewImages')
    }
}