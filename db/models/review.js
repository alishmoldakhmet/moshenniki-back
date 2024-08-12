'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {

    class Review extends Model {
        static associate(models) {

            Review.belongsTo(models.Admin, {
                as: 'admin',
                foreignKey: 'adminID'
            }),
            Review.belongsTo(models.Scammer, {
                as: 'scammer',
                foreignKey: 'scammerID'
            }),
            Review.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userID'
            }),
            Review.hasMany(models.ReviewImage, {
                as: 'galleries',
                foreignKey: 'reviewID'
            })
        }
    }

    Review.init(
        {
            title: DataTypes.TEXT,
            description: DataTypes.TEXT,
            adminID: DataTypes.BIGINT,
            scammerID: DataTypes.BIGINT,
            userID: DataTypes.BIGINT,
            anonymously: DataTypes.TINYINT,
            status: DataTypes.TINYINT
        },
        {
            sequelize,
            modelName: 'Review',
        }
    )

    return Review
}