
const Op = require('sequelize').Op

const Author = require("../models/author_model").Author
const Book = require("../models/book_model").Book


exports.findAll = function(options) {

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

    return Author.findAndCountAll(findWhere)
    .then((authors)=> {
        if (authors.rows.length > 0) {
            authors.rows.count = authors.count
            return authors.rows
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

   
exports.findOne = function(author) {

    return Author.findOne({
        where: {
            Id: author.Id,
        },
        include: {
            model: Book,
            required: false
        }
    }).then((author)=> {
        if (author) {
            return(author)
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


exports.delete = function(author) {
    
    return Author.destroy({ where: { Id: author.Id } })
    .then((author)=> {
        if (author) {
            return author
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


exports.create = function(author) {

    return Author.create(author)
    .then((author) => {
        if (author) {
            return author
        }
        else {
            const errors = [
                {message: "Could not create author."}
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


exports.update = function(author) {

    return Author.update({
        firstName:  author.firstName,
        lastName:   author.lastName,
        birthYear:  author.birthYear,
    },
    {where: {Id: author.Id}}
    ).then((affectedAuthors) => {
        if (affectedAuthors > 0) {
            return affectedAuthors
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
