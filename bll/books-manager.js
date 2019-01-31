const express = require('express')
const dal = require("../dal/books-repository")

exports.searchBooks = function(req, callback) {
    try {
        dal.searchBooks(req, function(books) {
            callback(books)
        })
    }
    catch (reason) {
        throw reason
    }
}

exports.getBookInfo = function(req, callback) {
    try {
        dal.getBookInfo(req, function(books) {
            callback(books)
        })
    }
    catch (reason) {
        throw reason
    }
}

exports.createBook = function(req) {
    return new Promise(function(resolve, reject) {
        dal.createBook(req, function(book) {
        }).then(function(book) {
            resolve(book)
        }).catch(function(error) {
            reject(error)
        })
    })

}


