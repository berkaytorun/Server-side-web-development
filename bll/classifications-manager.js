
const classificationsReository = require("../dal/repositories/classification-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = function() {
    return classificationsReository.findAll()
}

exports.findOne = function(classification) {
    try {
        return classificationsReository.findOne(classification)
    }
    catch (error) {
        return Promise.resolve(null)
    }
}

exports.findByPk = function(classification) {
    return classificationsReository.findByPk(classification)
}

exports.delete = function(authorityId, classification) {

    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        throw [{message: "You do not have permission to do that."}]
    }

    return classificationsReository.delete(classification)
}