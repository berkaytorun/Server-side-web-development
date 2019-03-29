
const classifications = require('./model_validator').classifications

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Classification = db.define('classification', {
    signId: {
        type: Sequelize.CHAR(11), // size 11
        primaryKey: true,
        unique: {
            args: true,
            msg: "That classification already exists."
        },
        
    },
    signum: {
        type: Sequelize.CHAR(50), // size 50
        allowNull: true,
        validate: {
            len: {
                args: [classifications.signum.min, classifications.signum.max],
                msg: "ISBN must be between exactly " + classifications.signum.min + " characters long."
            }
        }
    },
    description: {
        type: Sequelize.CHAR(255),
        dialectOptions: {
          charset: 'utf8mb4',
        },
        validate: {
            len: {
                args: [classifications.description.min, classifications.description.max],
                msg: "ISBN must be between exactly " + classifications.description.min + " characters long."
            }
        }
    }
})