
const bookAuthorRepository = require("../dal/repositories/book-authors-repository")

const authorityLevel = require("../objects").authorityLevel

exports.delete = function(authorityId, bookAuthor) {

    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        throw [{message: "You do not have permissions for that."}]
    }

    return bookAuthorRepository.delete(bookAuthor)
}

exports.create = function(authorityId, bookAuthor) {

    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        throw [{message: "You do not have permissions for that."}]
    }

    return bookAuthorRepository.create(bookAuthor)
}