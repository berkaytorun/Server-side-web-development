
const authorManager = require("../dal/repositories/authors-repository")

exports.findAll = function(options) {
    return new Promise(function(resolve, reject) {

        return authorManager.findAll(options)
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

        return authorManager.create(author)
        .then(function(newAuthor) {
            resolve(newAuthor)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findOne = function(author) {
    return new Promise(function(resolve, reject) {
        return authorManager.findOne(author)
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

        return authorManager.update(author)
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

        return authorManager.delete(author)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}


