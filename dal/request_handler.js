"use strict";

const Sequelize = require('sequelize')

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
            } else {
                response.error = "Unauthorized"
                reject(response)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

function getBooks(req, Book) {

    return new Promise((resolve, reject) => {
        let limit = 5
        let offset = 0
        Book.findAll({

            order: [
                ['title', 'ASC']
            ],
            
            limit: limit,
            offset: offset,

            where: {
                title: {
                    [Sequelize.Op.gt]: [req.query.title]
                }
            }
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
            reject(error)
        })
    })
}

function getBook(req, Book, Classification) {

    return new Promise((resolve, reject) => {
        Book.findOne({
                where: {ISBN: req.query.ISBN},
                include: [{
                    model: Classification,
                }]
            })
        .then((book) => {
            if (book) {
                let theBook = {
                    ISBN: book.ISBN,
                    title: book.title,
                    signID: book.signID,
                    publicationYear: book.publicationYear,
                    publicationInfo: book.publicationInfo,
                    pages: book.pages
                    }
                resolve(theBook)
            } else {
                let res = req.query.ISBN + " could not be found."
                reject(res)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}


exports.createAccount = createAccount
exports.createBook = createBook
exports.getBook = getBook
exports.getBooks = getBooks