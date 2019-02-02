
const Op = require('sequelize').Op

const Book = require("../models/book_model").Book
const Classification = require("../models/classification_model").Classification

exports.searchBooks = function(req) {
    return new Promise(function(resolve, reject) {

        let findWhere = {
        
            order: [
                ['title', 'ASC']
            ],
            
            limit: req.query.limit,
            offset: req.query.offset,
            where: { } 
        }
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
        Book.findAndCountAll(findWhere)
        .then((books)=> {
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
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}
    
exports.getBookInfo = function(req) {
    return new Promise(function(resolve, reject) {

        Book.findOne({
            where: {
                ISBN: req.query.ISBN,
            },
            include: [
                Classification
            ]
        }).then((book)=> {
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
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}

exports.bookDelete = function(req) {
    return new Promise(function(resolve, reject) {

        Book.destroy({
            where: {
                ISBN: req.query.ISBN,
            }
        }).then((book)=> {
            if (book) {
                resolve()
            }
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}

exports.editBookInfo = function(req) {
    return new Promise(function(resolve, reject) {
        Book.update({
            title: req.body.title,
            pages:req.body.pages,
            publicationInfo:req.body.publicationInfo,
            publicationYear:req.body.publicationYear,
            
        },
        {where: {ISBN: req.body.ISBN}}
        ).then((affectedBooks) => {
            if (affectedBooks > 0) {
                return resolve(affectedBooks)
            }
            const error = {
                errors: [
                    {message: "No matches found."}
                ]
            }
            reject(error)
        }).catch((error) => {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.createBook = function(req) {
    return new Promise(function(resolve, reject) {
        Book.create({
            ISBN: req.body.ISBN,
            title: req.body.title,
            pages:req.body.pages,
            publicationInfo:req.body.publicationInfo,
            publicationYear:req.body.publicationYear,
        }).then((book) => {
            if (book) {
                const newBook = {
                    ISBN: book.ISBN,
                    title: book.title,
                    signId: book.signId,
                    publicationYear: book.publicationYear,
                    publicationInfo: book.publicationInfo,
                    pages: book.pages
                }
                return resolve(newBook)
            }
        }).catch((error) => {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}