
const Op = require('sequelize').Op

const Classification = require("../models/classification_model").Classification
const Book = require("../models/book_model").Book


exports.findAll = function(options) {

    
    const toSearch = {
        where: { }
    }
    if (options && options.searchString !== "") {
        toSearch.where = {
            [Op.or]: [
                {signId: {
                        [Op.like]: options.searchString, 
                    }
                },
                {signum: {
                        [Op.like]: options.searchString, 
                    }
                },
            ]
        }
    }

    return Classification.findAndCountAll({
        distinct: true,
        order: [
            ['signum', 'ASC']
        ],
        
        limit: options.limit,
        offset: options.offset,

        where: toSearch.where,
        include: [
            {
                model: Book,
                required: false,
            }
        ]
    }).then((classification)=> {
        if (classification.rows.length > 0) {
            classification.rows.count = classification.count
            return classification.rows
        }
        else {
            return null
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

exports.findOne = function(classification) {

    return Classification.findOne({
        where: { signum: classification.signum },
        include: [
            {
                model: Book,
                required: false,
            }
        ]
    }).then((classification)=> {

        if (classification) {
            return classification
        }
        else {
            const errors = [
                {message: "No classifications found."}
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

exports.findByPk = function(classification) {

    return Classification.findByPk(classification.signId, {
        include: [
            {
                model: Book,
                required: false,
            }
        ]
    }).then((classification)=> {

        if (classification) {
            return classification
        }
        else {
            const errors = [
                {message: "No classifications found."}
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

exports.editByPk = function(classification) {

    return Classification.update(
        classification, 
        {where: {
            signId: classification.signId
        }
    }).then((classification)=> {

        if (classification) {
            return classification
        }
        else {
            const errors = [
                {message: "Classificaiton not found."}
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

exports.delete = function(classification) {

    return Classification.destroy({
        where: { 
            signId: classification.signId
        }
    }).then((result)=> {
        if (result) {
            return classification.signum + " deleted"
        }
        else {
            const errors = [
                {message: "Classification was not deleted. Please try again"}
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



exports.create = function(classification) {
    
    return Classification.create(classification).then((classification) => {
        if (classification) {
            return classification
        }
        else {
            const errors = [
                {message: "Could not create classification"}
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