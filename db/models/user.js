'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {

    class User extends Model {
        static associate() { }
    }

    User.init(
        {
            name: DataTypes.TEXT,
            email: DataTypes.TEXT,
            iin: DataTypes.TEXT,
            phone: DataTypes.TEXT,
            password: DataTypes.TEXT,
            token: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'User',
        }
    )

    return User
}