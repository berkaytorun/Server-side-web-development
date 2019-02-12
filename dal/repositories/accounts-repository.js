
const Op = require('sequelize').Op

const Account = require("../models/account_model").Account


exports.create = function(account) {
    
    return new Promise(function(resolve, reject) {
        Account.create(account)
        .then((account) => {
            if (account) {
                resolve(account)
            }
            else {

            }
        }).catch((error) => {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}