
const db = require("../sequelize_settings").db
const Sequelize = require("../sequelize_settings").Sequelize

exports.BookAuthor = db.define('bookauthor', {
    /*
    authorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: "Author",
            key: "Id"
        }
    },
    bookISBN: {
        type: Sequelize.CHAR(15),
        primaryKey: true,
        references: {
            model: "Book",
            key: "ISBN"
        }
    }*/
})