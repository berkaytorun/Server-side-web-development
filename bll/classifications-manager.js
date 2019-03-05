
const classificationsReository = require("../dal/repositories/classification-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = function() {
    return classificationsReository.findAll()
}

exports.findOne = function(classification) {
    return classificationsReository.findOne(classification)
}

exports.delete = function(authorityId, classification) {

    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        throw [{message: "You do not have permission to do that."}]
    }

    return classificationsReository.delete(classification)
}