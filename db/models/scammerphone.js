'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {


    class ScammerPhone extends Model {
        static associate() { }
    }


    ScammerPhone.init(
        {
            scammerID: DataTypes.BIGINT,
            phone: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'ScammerPhone',
        }
    )

    return ScammerPhone
}