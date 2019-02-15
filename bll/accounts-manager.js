
const dal = require("../dal/repositories/accounts-repository")



exports.create = function(account) {
    return new Promise(function(resolve, reject) {

        return dal.create(account)
        .then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.searchFor = function(account, options) {
    return new Promise(function(resolve, reject) {


        return dal.searchFor(options)
        .then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}