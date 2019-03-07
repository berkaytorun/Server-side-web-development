
const Classification = require("../models/classification_model").Classification
const Book = require("../models/book_model").Book


exports.findAll = function() {

    return Classification.findAll({
        where: { },
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

exports.findOne = function(classification) {

    return Classification.findAll({
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


exports.delete = function(classification) {

    return Classification.destroy({
        where: { signum: classification.signum }
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
