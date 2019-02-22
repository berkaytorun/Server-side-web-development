
const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Authority = db.define("authority", {
    authorityId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        validate: {
            customValidation(value) {
                if (value > 0 && value < 4) {
                    return; // accepted
                }
                throw new Error(value + " is not a recognized authority level.")
            }
        }
    },
    authorityName: {
        type: Sequelize.TEXT,
    }
})
