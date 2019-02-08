const express = require('express')
const dal = require("../dal/repositories/authors-repository")


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

