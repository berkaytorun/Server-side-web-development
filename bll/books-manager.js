
const bookManager = require("../dal/repositories/books-repository")
const dalClassifications = require("../dal/repositories/classification-repository")

exports.findAll = function(options) {
    const wrapper = []
    return new Promise(function(resolve, reject) {
        return bookManager.findAll(options)
        .then(function(books) {
            wrapper.push(books)
            return dalClassifications.findAll()
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

        if (!authorityId) {
            throw [{message: "You do not have permission to do that."}]
        }

        return bookManager.create(book)
        .then(function(newBook) {
            resolve(newBook)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findOne = function(book) {
    return new Promise(function(resolve, reject) {
        return bookManager.findOne(book)
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
        if (authorityId < ADMIN) {
            throw [{message: "You do not have permissions for that."}]
        }

        return bookManager.update(book, oldISBN)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(authorityId, book) {
    return new Promise(function(resolve, reject) {

        if (authorityId == undefined) {
            throw [{message: "You do not have permissions for that."}]
        }

        return bookManager.delete(book)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}
