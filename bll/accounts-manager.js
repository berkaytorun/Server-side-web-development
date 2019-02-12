
const dal = require("../dal/repositories/accounts-repository")



exports.create = function(account) {
    return new Promise(function(resolve, reject) {

        return dal.create(account)
        .then(function(authors) {
            resolve(authors)
        }).catch(function(error) {
            reject(error)
        })
    })
}