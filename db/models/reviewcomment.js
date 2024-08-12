'use strict'
const { Model } = require('sequelize')


module.exports = (sequelize, DataTypes) => {


    class ReviewComment extends Model {
        static associate() { }
    }


    ReviewComment.init(
        {
            reviewID: DataTypes.BIGINT,
            image: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'ReviewComment',
        }
    )

    return ReviewComment
}