
const booksRepository = require("../dal/repositories/books-repository")
const classificationsReository = require("../dal/repositories/classification-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = async function(options) {

    const books = booksRepository.findAll(options)
    const classifications = classificationsReository.findAll()
    const wrapper = await Promise.all([books, classifications])

    return wrapper

}

exports.create = function(authorityId, book) {
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{message: "You do not have permission to do that."}])
    }

    return booksRepository.create(book)
}

exports.findOne = function(book) {
    return booksRepository.findOne(book)
}

exports.update = function(authorityId, book, oldISBN) {
    
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{message: "You do not have permission to do that."}])
    }

    return booksRepository.update(book, oldISBN)
}

exports.delete = function(authorityId, book) {
    
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        throw [{message: "You do not have permission to do that."}]
    }

    return booksRepository.delete(book)
    
}
