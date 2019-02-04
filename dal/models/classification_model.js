
const classifications = require('./model_validator').classifications

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Classification = db.define('classification', {
    signId: {
        type: Sequelize.TEXT, // size 11
        primaryKey: true,
    },
    signum: {
        type: Sequelize.TEXT, // size 50
        allowNull: true,
        validate: {
            len: {
                args: [classifications.signum.min, classifications.signum.max],
                msg: "ISBN must be between exactly " + classifications.signum.min + " characters long."
            }
        }
    },
    description: {
        type: Sequelize.TEXT,
        validate: {
            len: {
                args: [classifications.description.min, classifications.description.max],
                msg: "ISBN must be between exactly " + classifications.description.min + " characters long."
            }
        }
    }
})