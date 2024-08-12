'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ScammerPhones', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            scammerID: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: { model: 'Scammers', key: 'id' },
                onDelete: 'CASCADE'
            },
            phone: {
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
        await queryInterface.dropTable('ScammerPhones')
    }
}