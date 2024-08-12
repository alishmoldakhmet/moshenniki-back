'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {

    class Admin extends Model {
        static associate() { }
    }

    Admin.init(
        {
            name: DataTypes.TEXT,
            email: DataTypes.TEXT,
            password: DataTypes.TEXT,
            token: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Admin',
        }
    )

    return Admin
}