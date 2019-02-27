
const classificationsReository = require("../dal/repositories/classification-repository")

exports.findAll = function() {
    return new Promise(function(resolve, reject) {
        return classificationsReository.findAll()
        .then(function(classifications) {
            resolve(classifications)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findOne = function(classification) {
    return new Promise(function(resolve, reject) {
        return classificationsReository.findOne(classification)
        .then(function(classifications) {
            resolve(classifications)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(authorityId, classification) {
    return new Promise(function(resolve, reject) {

        const SUPER = 2
        if (authorityId == undefined || authorityId < SUPER) {
            throw [{message: "You do not have permission to do that."}]
        }

        return classificationsReository.delete(classification)
        .then(function(classifications) {
            resolve(classifications)
        }).catch(function(error) {
            reject(error)
        })
    })
}