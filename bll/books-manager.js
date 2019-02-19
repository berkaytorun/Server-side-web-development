const express = require('express')
const dal = require("../dal/repositories/books-repository")



exports.editBookInfo = function(req) {
    return new Promise(function(resolve, reject) {

        

        return dal.editBookInfo(req)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.searchBooks = function(req) {
    return new Promise(function(resolve, reject) {

        return dal.searchBooks(req)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.bookDelete = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.bookDelete(req)
        .then(function() {



            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.getBookInfo = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.getBookInfo(req)
        .then(function(bookInfo) {
            resolve(bookInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.createBook = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.createBook(req)
        .then(function(newBook) {
            resolve(newBook)
        }).catch(function(error) {
            reject(error)
        })
    })
}


