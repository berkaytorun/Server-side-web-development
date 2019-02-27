
const bookValid = require('./model_validator').bookValid

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Book = db.define('book', {
    ISBN: {
        type: Sequelize.CHAR(15),
        primaryKey: true,
        unique: {
            args: true,
            msg: "That ISBN already exists."
        }
    },
    title: {
        type: Sequelize.CHAR(bookValid.title.max),
        validate: {
            len: {
                args: [bookValid.title.min, bookValid.title.max],
                msg: "Book title needs to be between " +
                    bookValid.title.min + " and " +
                    bookValid.title.max + " characters long."
            }
        }
    },
    publicationYear: {
        type: Sequelize.CHAR(bookValid.publicationYear.max),
        validate: {
            len: {
                args: [bookValid.publicationYear.min, bookValid.publicationYear.max],
                msg: "Publication-year needs to be between " +
                    bookValid.publicationYear.min + " and " + 
                    bookValid.publicationYear.max + " digits long."
            }
        }
    },
    publicationInfo: {
        type: Sequelize.CHAR(bookValid.publicationInfo.max),
        validate: {
            len: {
                args: [bookValid.publicationInfo.min, bookValid.publicationInfo.max],
                msg: "Publication-info field needs to be between " +
                    bookValid.publicationInfo.min + " and " +
                    bookValid.publicationInfo.max + " characters long."
            }
        }
    },
    pages: {
        type: Sequelize.INTEGER,
    },
    signId: {
        type: Sequelize.CHAR(11),
        unique: false
    },
})