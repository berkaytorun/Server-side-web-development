
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
                const error = {
                    errors: [
                        {message: "Could not add account."}
                    ]
                }
                reject(error)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}