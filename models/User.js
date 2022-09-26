const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');



//create user model
class User extends Model {};

//define table and column config
User.init(
    {
        //Table Column Definitions here
        //id column
        id: {
            //use the sequelize datatypes obj to provide what type of data it is
            type: DataTypes.INTEGER,
            //Like sqls NOT NULL
            allowNull: false,
            //Primary key
            primaryKey:true,
            //auto increment
            autoIncrement:true
        },
        username: {
            type:DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // only one of each can be passed into table
            unique: true,
            //can run thru email validator
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //length
                len:[4]
            }
        }
    },
    {
        hooks: {
            //set up beforeCreate lifecycle hook functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password,10);
                return newUserData;
            },
            //set up before Update
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password,10);
                return updatedUserData;
            }
        },
        //Table configuration options go here
        //pass in imported sequilize connection
        sequelize,
        //dont automatically create timestamp fields
        timestamps: false,
        //dont pluralize name of bd table
        freezeTableName: true,
        //underscores instead of camelCasing
        underscored:true,
        //make it so model name is lowercase in db
        modelName: 'user'
    }
);

module.exports = User;