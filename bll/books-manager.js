
const bookRepository = require("../dal/repositories/books-repository")
const classificationsReository = require("../dal/repositories/classification-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = function(options) {
    const wrapper = []
    return bookRepository.findAll(options)
    .then(function(books) {
        wrapper.push(books)

        return classificationsReository.findAll()
    }).then(function(classifications) {
        wrapper.push(classifications)

        return Promise.resolve(wrapper)
    }).catch(function(error) {
        throw error
    })
}

exports.create = function(authorityId, book) {
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{message: "You do not have permission to do that."}])
    }

    return bookRepository.create(book)
}

exports.findOne = function(book) {
    return bookRepository.findOne(book)
}

exports.update = function(authorityId, book, oldISBN) {
    
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{message: "You do not have permission to do that."}])
    }

    return bookRepository.update(book, oldISBN)
}

exports.delete = function(authorityId, book) {
    
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        throw [{message: "You do not have permission to do that."}]
    }

    return bookRepository.delete(book)
    
}
