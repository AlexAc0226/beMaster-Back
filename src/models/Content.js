const { DataTypes } = require('sequelize');

const sequelize = require('../db')

const Content = sequelize.define('content', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Content

