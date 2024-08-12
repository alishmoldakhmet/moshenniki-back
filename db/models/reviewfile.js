'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {


    class ReviewFile extends Model {
        static associate() { }
    }


    ReviewFile.init(
        {
            reviewID: DataTypes.BIGINT,
            file: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'ReviewFile',
        }
    )

    return ReviewFile
}