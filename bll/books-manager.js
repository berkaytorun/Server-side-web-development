
const bookRepository = require("../dal/repositories/books-repository")
const classificationsReository = require("../dal/repositories/classification-repository")

exports.findAll = function(options) {
    const wrapper = []
    return new Promise(function(resolve, reject) {
        return bookRepository.findAll(options)
        .then(function(books) {
            wrapper.push(books)
            return classificationsReository.findAll()
        }).then(function(classifications) {
            wrapper.push(classifications)
            resolve(wrapper)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.create = function(authorityId, book) {
    return new Promise(function(resolve, reject) {

        if (authorityId == undefined || authorityId < ADMIN) {
            throw [{message: "You do not have permission to do that."}]
        }

        return bookRepository.create(book)
        .then(function(newBook) {
            resolve(newBook)
        }).catch(function(error) {
            reject(error)
        })
    })
}



exports.findOne = function(book) {
    return new Promise(function(resolve, reject) {
        return bookRepository.findOne(book)
        .then(function(bookInfo) {
            resolve(bookInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.update = function(authorityId, book, oldISBN) {
    return new Promise(function(resolve, reject) {

        

        const ADMIN = 2
        if (authorityId == undefined || authorityId < ADMIN) {
            throw [{message: "You do not have permissions for that."}]
        }

        return bookRepository.update(book, oldISBN)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(authorityId, book) {
    return new Promise(function(resolve, reject) {

        const ADMIN = 2
        if (authorityId == undefined || authorityId < ADMIN) {
            throw [{message: "You do not have permissions for that."}]
        }

        return bookRepository.delete(book)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}
