'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {


    class ScammerName extends Model {
        static associate() { }
    }


    ScammerName.init(
        {
            scammerID: DataTypes.BIGINT,
            name: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'ScammerName',
        }
    )

    return ScammerName
}