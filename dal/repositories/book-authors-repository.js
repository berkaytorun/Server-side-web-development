
const BookAuthor = require("../models/book_author_model").BookAuthor
const Author = require("../models/author_model").Author


exports.delete = function(bookAuthor) {
    return new Promise(function(resolve, reject) {

        BookAuthor.destroy({
            where: {
                bookISBN: bookAuthor.bookISBN,
                authorId: bookAuthor.authorId
            }
        }).then((result)=> {
            if (result) {
                resolve()
            }
            else {
                const errors = [
                    {message: "Could not unlink author from book."}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    throw error;
                }
            }
            return reject(error.errors)
        })
    })
}

exports.create = function(bookAuthor) {
    return new Promise(function(resolve, reject) {

        BookAuthor.create({
                bookISBN: bookAuthor.bookISBN,
                authorId: bookAuthor.authorId
        }).then((result)=> {
            if (result) {
                resolve()
            }
            else {
                const errors = [
                    {message: "Could not unlink author from book."}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([{message: error.message}])
                    return;
                }
                else {
                    throw error;
                }
            }
            for (let i = 0; i < error.errors.length; i++) {
                if (error.errors[i].message == "PRIMARY must be unique") {
                    error.errors[i].message = "This connection already exists."
                }
            }
            return reject(error.errors)
        })
    })
}
