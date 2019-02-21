
const Op = require('sequelize').Op

const Book = require("../models/book_model").Book
const Classification = require("../models/classification_model").Classification
const Author = require("../models/author_model").Author

exports.searchBooks = function(options) {
    return new Promise(function(resolve, reject) {

        let findWhere = {
        
            distinct: true,
            order: [
                ['title', 'ASC']
            ],
            
            limit: options.limit,
            offset: options.offset,
            
            where: { },
            include: [
                {
                    model: Classification,
                    required: false
                },
                {
                    model: Author,
                }
            ],
            
        }
        if (options.searchString !== "") {
    
            findWhere.where = {
                [Op.or]: [
                    {ISBN: {
                            [Op.like]: options.searchString, 
                        }
                    },
                    {title: {
                            [Op.like]: options.searchString, 
                        }
                    },
                ]
            }
        }
        Book.findAndCountAll(findWhere)
        .then((books)=> {
            if (books.rows.length > 0) {
                books.rows.count = books.count
                resolve(books.rows)
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
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}
    
exports.getBookInfo = function(book) {
    return new Promise(function(resolve, reject) {

        Book.findOne({
            where: {
                ISBN: book.ISBN,
            },
            include:[ 
                { 
                    model: Author,
                    required: false
                },
                {
                    model: Classification,
                    required: false
                }
            ]
            
        }).then((book)=> {
            if (book) {
                resolve(book)
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
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}

exports.delete = function(book) {
    return new Promise(function(resolve, reject) {

        Book.destroy({
            where: {
                ISBN: book.ISBN,
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
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}

exports.update = function(book, oldISBN) {
    return new Promise(function(resolve, reject) {
        Book.update(book, {where: {ISBN: oldISBN},})
        .then(function(affectedBooks) {
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
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.create = function(book) {
    return new Promise(function(resolve, reject) {
        Book.create(book).then((book) => {
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
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error)
        })
    })
}