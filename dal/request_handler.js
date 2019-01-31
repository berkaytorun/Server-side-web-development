"use strict";

const Op = require('sequelize').Op

function createAccount(req, Account) {
    return new Promise((resolve, reject) => {
        Account.create({
            userName: req.body.userName,
            password: req.body.password
        }).then((result) => {
            let response = {}
            if (result) {
                response.accountId = result.id
                response.userName = result.userName
                resolve(response)
            } 
            else {
                let res = "No maches found."
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

function createAuthor(req, Author) {
    return new Promise((resolve, reject) => {
        Author.bulkCreate(req.mockData.authors)
        .then((result) => {
            let response = {}
            if (result) {
                response.accountId = result.id
                response.userName = result.userName
                resolve(response)
            } 
            else {
                let res = "No maches found."
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

function createBook(req, Book) {
    return new Promise((resolve, reject) => {
        Book.bulkCreate(req.mockData.books)
        .then((result) => {
            let response = {}
            if (result) {
                response.accountId = result.id
                response.userName = result.userName
                resolve(response)
            } 
            else {
                let res = "No maches found."
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}



exports.createAccount = createAccount
exports.createBook = createBook