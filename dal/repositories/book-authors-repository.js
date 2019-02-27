
const BookAuthor = require("../models/book_author_model").BookAuthor


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
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}
