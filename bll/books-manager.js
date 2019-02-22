const express = require('express')
const dal = require("../dal/repositories/books-repository")

const authority = require("./functionality/authority")

exports.update = function(session, book, oldISBN) {
    return new Promise(function(resolve, reject) {

        if (!session.canUpdateBooks) {
            throw [{message: "You do not have permissions for that."}]
        }

        return dal.update(book, oldISBN)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.searchBooks = function(options) {
    return new Promise(function(resolve, reject) {

        return dal.searchBooks(options)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(session, book) {
    return new Promise(function(resolve, reject) {

        if (!session.canDeleteBooks) {
            throw [{message: "You do not have permissions for that."}]
        }

        return dal.delete(book)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.getBookInfo = function(book) {
    return new Promise(function(resolve, reject) {
        return dal.getBookInfo(book)
        .then(function(bookInfo) {
            resolve(bookInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.create = function(session, book) {
    return new Promise(function(resolve, reject) {

        if (!session.canCreateBooks) {
            throw [{message: "You do not have permission to do that."}]
        }

        return dal.create(book)
        .then(function(newBook) {
            resolve(newBook)
        }).catch(function(error) {
            reject(error)
        })
    })
}


