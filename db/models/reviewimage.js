'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {


    class ReviewImage extends Model {
        static associate() { }
    }


    ReviewImage.init(
        {
            reviewID: DataTypes.BIGINT,
            image: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'ReviewImage',
        }
    )

    return ReviewImage
}