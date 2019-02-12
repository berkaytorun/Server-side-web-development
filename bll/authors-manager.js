
const dal = require("../dal/repositories/authors-repository")



exports.editAuthorInfo = function(req) {
    return new Promise(function(resolve, reject) {

        return dal.editAuthorInfo(req)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.searchAuthors = function(req) {
    return new Promise(function(resolve, reject) {

        return dal.searchAuthors(req)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.getAuthorInfo = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.getAuthorInfo(req)
        .then(function(authorInfo) {
            resolve(authorInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.authorDelete = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.authorDelete(req)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.createAuthor = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.createAuthor(req)
        .then(function(newAuthor) {
            resolve(newAuthor)
        }).catch(function(error) {
            reject(error)
        })
    })
}

