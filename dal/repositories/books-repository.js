
const Op = require('sequelize').Op

const Book = require("../models/book_model").Book
const Classification = require("../models/classification_model").Classification
const classificationsReository = require("../repositories/classification-repository")

const Author = require("../models/author_model").Author

exports.findAll = function(options) {

    const toInclude = { 
        include: [
            {model: Author},
            {model: Classification}
        ] 
    }
    if (options && options.classification != "") {
        toInclude.include[1] = {
            model: Classification,
            required: true,
            where: {
                signum: {[Op.like]: options.classification}
            }
        }
    }

    const toSearch = {
        where: { }
    }
    if (options && options.searchString !== "") {
        toSearch.where = {
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

    let findWhere = {
    
        distinct: true,
        order: [
            ['title', 'ASC']
        ],
        
        limit: options.limit,
        offset: options.offset,
        
        where: toSearch.where,
        include: toInclude.include
    }

    return Book.findAndCountAll(findWhere)
    .then((books)=> {
        if (books.rows.length > 0) {
            books.rows.count = books.count
            return (books.rows)
        }
        else {
            let errors = []
            if (options.classification != "") {
                classificationsReository.findOne({signum: options.classification})
                .then(function(classification) {
                    if (options.searchString != "") {
                        errors.push({message: "There are no books matching in the classification."})
                    }
                    else {
                        errors.push({message: "Classification empty"})
                    }
                    throw errors
                }).catch(function(error) {
                    // classification does not exist
                    errors.push({message: "Classification does not exist."})
                    throw errors
                })

            }
            else {
                errors.push({message: "3"})
                throw errors
            }
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}
    
exports.findOne = function(book) {
    
    return Book.findOne({
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
            return book
        }
        else {
            const errors = [
                {message: "No matches found"}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}

exports.delete = function(book) {
    
    return Book.destroy({
        where: {
            ISBN: book.ISBN,
        }
    }).then((result)=> {
        if (result) {
            return result
        }
        else {
            const errors = [
                {message: "No matches found"}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}

exports.update = function(book, oldISBN) {
    
    return Book.update(book, {where: {ISBN: oldISBN},})
    .then(function(affectedBooks) {
        if (affectedBooks > 0) {
            return affectedBooks
        }
        else {
            const errors = [
                {message: "No matches found"}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}


exports.create = function(book) {
    
    return Book.create(book).then((book) => {
        if (book) {
            const newBook = {
                ISBN: book.ISBN,
                title: book.title,
                signId: book.signId,
                publicationYear: book.publicationYear,
                publicationInfo: book.publicationInfo,
                pages: book.pages
            }
            return newBook
        }
        else {
            const errors = [
                {message: "Could not create book"}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}