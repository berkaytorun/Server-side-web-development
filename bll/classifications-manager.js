
const classificationsReository = require("../dal/repositories/classification-repository")

exports.findAll = function() {
    return new Promise(function(resolve, reject) {
        return classificationsReository.findAll()
        .then(function(classifications) {
            resolve(classifications)
        }).catch(function(error) {
            reject(error)
        })
    })
}