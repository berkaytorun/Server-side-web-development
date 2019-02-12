
const dal = require("../dal/repositories/accounts-repository")



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