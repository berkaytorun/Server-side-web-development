"use strict";

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
            } else {
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
        Book.bulkCreate(req.mockData.books)
        .then((result) => {
            let response = {}
            if (result) {
                response.accountId = result.id
                response.userName = result.userName
                resolve(response)
            } else {
                response.error = "Unauthorized"
                reject(response)
            }
        }).catch((error) => {
            reject(parseError(error))
        })
    })
}

function getBooks(req, Book) {
    return new Promise((resolve, reject) => {
        Book.findAll({
            
        })
        .then((books) => {
            let response = {}
            if (books) {
                            
                let booksList = [ ]
                for (let i = 0, len = books.length; i < len; i++) {
                    booksList.push({
                        ISBN: books[i].ISBN,
                        title: books[i].title,
                        signID: books[i].signID,
                        publicationYear: books[i].publicationYear,
                        publicationInfo: books[i].publicationInfo,
                        pages: books[i].pages
                    })
                }
                resolve(booksList)
            } else {
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
exports.getBooks = getBooks