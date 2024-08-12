'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

    class Scammer extends Model {
        static associate(models) {
            Scammer.hasMany(models.Review, {
                as: 'review',
                foreignKey: 'scammerID'
            }),
            Scammer.hasMany(models.ScammerName, {
                as: 'scammername',
                foreignKey: 'scammerID'
            })
            Scammer.hasMany(models.ScammerPhone, {
                as: 'scammerphone',
                foreignKey: 'scammerID'
            })
        }
    }

    Scammer.init(
        {
            iin: DataTypes.TEXT,
            email: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Scammer',
        }
    )

    return Scammer
}