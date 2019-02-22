
const dal = require("../dal/repositories/authors-repository")

const authority = require("./functionality/authority")

exports.findOne = function(author) {
    return new Promise(function(resolve, reject) {
        return dal.findOne(author)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.search = function(options) {
    return new Promise(function(resolve, reject) {

        return dal.search(options)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.update = function(session, author) {
    return new Promise(function(resolve, reject) {

        if (!session.canUpdateAuthors) {
            throw [{message: "You do not have permission to do that."}]
        }

        return dal.update(author)
        .then(function(authorInfo) {
            resolve(authorInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(session, author) {
    return new Promise(function(resolve, reject) {

        if (!session.canDeleteAuthors) {
            throw[{message: "You do not have permission to do that."}]
        }

        return dal.delete(author)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.create = function(session, author) {
    return new Promise(function(resolve, reject) {

        if (!session.canCreateAuthors) {
            throw[{message: "You do not have permission to do that."}]
        }

        return dal.create(author)
        .then(function(newAuthor) {
            resolve(newAuthor)
        }).catch(function(error) {
            reject(error)
        })
    })
}

