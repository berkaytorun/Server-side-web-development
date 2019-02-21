
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

   
exports.getAuthorInfo = function(req) {
    return new Promise(function(resolve, reject) {

        Author.findOne({
            where: {
                Id: req.query.Id,
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


exports.authorDelete = function(req) {
    return new Promise(function(resolve, reject) {

        Author.destroy({
            where: {
                Id: req.query.Id,
            }
        }).then((author)=> {
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


exports.createAuthor = function(req) {
    return new Promise(function(resolve, reject) {
        Author.create({
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            birthYear:req.body.birthYear,
        }).then((author) => {
            if (author) {
                const newAuthor = {
                    Id: author.Id,
                    firstName: author.firstName,
                    lastName:author.lastName,
                    birthYear:author.birthYear,
                }
                return resolve(newAuthor)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.editAuthorInfo = function(req) {
    return new Promise(function(resolve, reject) {
        Author.update({

            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            birthYear:  req.body.birthYear,
            
        },
        {where: {Id: req.body.Id}}
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
