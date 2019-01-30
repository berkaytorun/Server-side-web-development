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

function getBookInfo(ISBN, Book, Classification) {

    return new Promise((resolve, reject) => {
        Book.findOne({
            where: {
                ISBN: ISBN,
            },
            include: [
                Classification
            ]
        })
        .then((book) => {
            let response = {}
            if (book) {
                            
                let theBook = {
                    ISBN: book.ISBN,
                    title: book.title,
                    signId: book.signId,
                    publicationYear: book.publicationYear,
                    publicationInfo: book.publicationInfo,
                    pages: book.pages
                }
                if (theBook.signId) {
                    theBook.signId = {
                        signum: book.classification.signum,
                        description: book.classification.description
                    }
                }
                resolve(theBook)
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

function searchBooks(query, Book) {

    return new Promise((resolve, reject) => {
        
        let findWhere = { 
            
            order: [
                ['title', 'ASC']
            ],
            
            limit: query.limit,
            offset: query.offset,
            where: { } 
        }
        if (query.searchString !== "") {

            findWhere.where = {
                [Op.or]: [
                    {ISBN: {
                        [Op.like]: query.searchString, 
                        }
                    },
                    {title: {
                        [Op.like]: query.searchString, 
                        }
                    }
                ]
            }
        }
        Book.findAndCountAll(findWhere)
        .then((books) => {
            if (books.rows.length > 0) {
                let booksList = [ ]
                for (let i = 0, len = books.rows.length; i < len; i++) {
                    booksList.push({
                        ISBN: books.rows[i].ISBN,
                        title: books.rows[i].title,
                        signId: books.rows[i].signId,
                        publicationYear: books.rows[i].publicationYear,
                        publicationInfo: books.rows[i].publicationInfo,
                        pages: books.rows[i].pages
                    })
                }
                booksList.total = books.count
                resolve(booksList)
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
exports.searchBooks = searchBooks
exports.getBookInfo = getBookInfo