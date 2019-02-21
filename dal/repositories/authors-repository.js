
const Op = require('sequelize').Op

const Author = require("../models/author_model").Author
const Book = require("../models/book_model").Book


exports.search = function(options) {
    return new Promise(function(resolve, reject) {

        let findWhere = {
        
            distinct: true,
            order: [['firstName', 'ASC']],
            limit: options.limit,
            offset: options.offset,
            where: { },
            include: [{
                model: Book,
                required: false
            }],
        }
        
        if (options.searchString !== "") {
    
            findWhere.where = {
                [Op.or]: [
                    {firstName: {
                        [Op.like]: options.searchString, 
                        }
                    },
                    {lastName: {
                        [Op.like]: options.searchString, 
                        }
                    }
                ]
            }
        }

        Author.findAndCountAll(findWhere)
        .then((authors)=> {
            if (authors.rows.length > 0) {
                authors.rows.count = authors.count
                resolve(authors.rows)
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

   
exports.findOne = function(author) {
    return new Promise(function(resolve, reject) {

        Author.findOne({
            where: {
                Id: author.Id,
            },
            include: {
                model: Book,
                required: false
            }
        }).then((author)=> {
            if (author) {
                resolve(author)
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


exports.delete = function(author) {
    return new Promise(function(resolve, reject) {

        Author.destroy({ where: { Id: author.Id } })
        .then((author)=> {
            if (author) {
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


exports.create = function(author) {
    return new Promise(function(resolve, reject) {
        Author.create(author)
        .then((author) => {
            if (author) {
                return resolve(author)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.update = function(author) {
    return new Promise(function(resolve, reject) {
        Author.update({
            firstName:  author.firstName,
            lastName:   author.lastName,
            birthYear:  author.birthYear,
        },
        {where: {Id: author.Id}}
        ).then((affectedAuthors) => {
            if (affectedAuthors > 0) {
                return resolve(affectedAuthors)
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
