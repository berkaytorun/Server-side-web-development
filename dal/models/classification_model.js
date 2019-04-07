
const classifications = require('./model_validator').classifications

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Classification = db.define('classification', {
    signId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: {
            args: true,
            msg: "That classification already exists."
        },
    },
    signum: {
        type: Sequelize.CHAR(classifications.signum.max),
        allowNull: true,
        dialectOptions: {
          charset: 'utf8mb4',
        },
        validate: {
            len: {
                args: [classifications.signum.min, classifications.signum.max],
                msg: "Signum must be between between " + classifications.signum.min +
                " and " + classifications.signum.max + " characters long."
            }
        }
    },
    description: {
        type: Sequelize.CHAR(classifications.description.max),
        dialectOptions: {
          charset: 'utf8mb4',
        },
        validate: {
            len: {
                args: [classifications.description.min, classifications.description.max],
                msg: "Description must be between between " + classifications.description.min +
                " and " + classifications.description.max + " characters long."

            }
        }
    }
})