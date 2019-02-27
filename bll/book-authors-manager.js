
const bookAuthorRepository = require("../dal/repositories/book-authors-repository")

exports.delete = function(authorityId, bookAuthor) {
    return new Promise(function(resolve, reject) {

        const ADMIN = 2
        if (authorityId == undefined || authorityId < ADMIN) {
            throw [{message: "You do not have permissions for that."}]
        }

        return bookAuthorRepository.delete(bookAuthor)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}