"use strict";

function createAccount(req, Account) {
    return new Promise((resolve, reject) => {
        Account.create({
            userName: req.body.userName,
            password: req.body.password
        }).then((result) => {
            let response = {}
            if (result) {
                response.status = 201
                response.accountId = result.id
                response.userName = result.userName
                resolve(response)
            } else {
                response.status = 401
                response.error = "Unauthorized"
                reject(response)
            }
        }).catch((error) => {
            reject(parseError(error))
        })
    })
}

function createBook(req, Book) {
    return new Promise((resolve, reject) => {
        Book.create({
            userName: req.body.userName,
            password: req.body.password
        }).then((result) => {
            let response = {}
            if (result) {
                response.status = 201
                response.accountId = result.id
                response.userName = result.userName
                resolve(response)
            } else {
                response.status = 401
                response.error = "Unauthorized"
                reject(response)
            }
        }).catch((error) => {
            reject(parseError(error))
        })
    })
}


exports.createAccount = createAccount
exports.createBook = createBook