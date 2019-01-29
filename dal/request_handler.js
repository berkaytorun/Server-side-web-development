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
            } else {
                response.error = "Unauthorized"
                reject(response)
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
                    [Op.gt]: [req.query.title]
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

function searchBooks(req, Book, Classification) {


    return new Promise((resolve, reject) => {
        
        let findWhere = { where: { } }
        if (req.query.searchString !== "") {
            findWhere.where = {
                [Op.or]: [
                    {ISBN: {
                        [Op.like]: req.query.searchString, 
                        }
                    },
                    {title: {
                        [Op.like]: req.query.searchString, 
                        }
                    }
                ]
            }
        }
        Book.findAll(
            findWhere
        )
        .then((books) => {
            if (books.length > 0) {
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
exports.searchBooks = searchBooks
exports.getBooks = getBooks