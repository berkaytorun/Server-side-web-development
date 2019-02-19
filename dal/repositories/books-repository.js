
const Op = require('sequelize').Op

const Book = require("../models/book_model").Book
const Classification = require("../models/classification_model").Classification
const Author = require("../models/author_model").Author

exports.searchBooks = function(req) {
    return new Promise(function(resolve, reject) {

        let findWhere = {
        
            order: [
                ['title', 'ASC']
            ],
            
            limit: req.query.limit,
            offset: req.query.offset,
            
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
            if (error.errors == null || error.errors.length == 0) {
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
            if (error.errors == null || error.errors.length == 0) {
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
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}