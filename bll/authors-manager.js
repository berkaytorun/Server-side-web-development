
const authorRepository = require("../dal/repositories/authors-repository")

exports.findAll = function(options) {
    return new Promise(function(resolve, reject) {

        return authorRepository.findAll(options)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.create = function(authorityId, author) {
    return new Promise(function(resolve, reject) {

        if (authorityId == undefined) {
            throw[{message: "You do not have permission to do that."}]
        }

        return authorRepository.create(author)
        .then(function(newAuthor) {
            resolve(newAuthor)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findOne = function(author) {
    return new Promise(function(resolve, reject) {
        return authorRepository.findOne(author)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.update = function(authorityId, author) {
    return new Promise(function(resolve, reject) {

        const ADMIN = 2
        if (authorityId < ADMIN) {
            throw [{message: "You do not have permission to do that."}]
        }

        return authorRepository.update(author)
        .then(function(authorInfo) {
            resolve(authorInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(authorityId, author) {
    return new Promise(function(resolve, reject) {

        const SUPER = 3
        if (authorityId < SUPER) {
            throw[{message: "You do not have permission to do that."}]
        }

        return authorRepository.delete(author)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}


