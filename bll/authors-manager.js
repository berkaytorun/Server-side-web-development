
const authorRepository = require("../dal/repositories/authors-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = function(options) {

    return authorRepository.findAll(options)

}

exports.create = function(authorityId, author) {
    
    if (authorityId == undefined) {
        throw[{message: "You do not have permission to do that."}]
    }

    return authorRepository.create(author)
    
}

exports.findOne = function(author) {
    
    return authorRepository.findOne(author)

}

exports.update = function(authorityId, author) {
    
    const ADMIN = 2
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        throw [{message: "You do not have permission to do that."}]
    }

    return authorRepository.update(author)
    
}

exports.delete = function(authorityId, author) {
    
    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        throw[{message: "You do not have permission to do that."}]
    }

    return authorRepository.delete(author)
}


