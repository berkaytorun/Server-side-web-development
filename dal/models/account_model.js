

const accValid = require('../model_validator').accValid

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Account = db.define("account", {
    userName: {
        type: Sequelize.TEXT(accValid.name.max),
        allowNull: false,
        unique: {
            args: true,
            msg: "That user name already exists."
        },
        validate: {
            len: {
                args: [accValid.name.min, accValid.name.max],
                msg: "Username needs to be between " +
                    accValid.name.min + " and " +
                    accValid.name.max + " characters long."
            }
        }
    },
    password: {
        type: Sequelize.TEXT(accValid.passw.max),
        allowNull: false,
        validate: {
            len: {
                args: [accValid.passw.min, accValid.passw.max],
                msg: "Password needs to be between " +
                    accValid.passw.min + " and " +
                    accValid.passw.max + " characters long."
            }
        }
    },            
})
