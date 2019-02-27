
const Classification = require("../models/classification_model").Classification
const Book = require("../models/book_model").Book


exports.findAll = function() {
    return new Promise(function(resolve, reject) {

        Classification.findAll({
            where: { },
            include: [
                {
                    model: Book,
                    required: false,
                }
            ]
        }).then((classification)=> {

            if (classification) {
                resolve(classification)
            }
            else {
                const errors = [
                    {message: "No classifications found."}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}

exports.findOne = function(classification) {
    return new Promise(function(resolve, reject) {

        Classification.findAll({
            where: { signum: classification.signum },
            include: [
                {
                    model: Book,
                    required: false,
                }
            ]
        }).then((classification)=> {

            if (classification) {
                resolve(classification)
            }
            else {
                const errors = [
                    {message: "No classifications found."}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}


exports.delete = function(classification) {
    return new Promise(function(resolve, reject) {

        Classification.destroy({
            where: { signum: classification.signum }
        }).then((result)=> {
            if (result) {
                resolve(classification.signum + " deleted")
            }
            else {
                const errors = [
                    {message: "Classification was not delted. Please try again"}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}
