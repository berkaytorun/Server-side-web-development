
const levels = [
    "Moderator",
    "Admin",
    "Super"
]
exports.levels = levels

const accValid = require('../models/model_validator').accValid

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Account = db.define("account", {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
        type: Sequelize.CHAR(accValid.name.max),
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
        type: Sequelize.CHAR(accValid.passw.max),
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
    firstName: {
        type: Sequelize.CHAR(accValid.passw.max),
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
    lastName: {
        type: Sequelize.CHAR(accValid.passw.max),
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
    authorityLevel: {
        type: Sequelize.TEXT,
        allowNull: false, 
        validate: {
          customValidation(value) {
            if (levels.includes(value)) {
                return; // accepted
            }
            throw new Error(value + " is not a recognized authority level.")
          }
        }
    }
})
