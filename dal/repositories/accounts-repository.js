
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

exports.login = function(account) {
    return new Promise(function(resolve, reject) {
        Account.find({
            where: {
                userName: account.userName
            }
        })
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

exports.searchFor = function(options) {
    options = {

    }
    return new Promise(function(resolve, reject) {
        Account.findAll(options)
        .then((accounts) => {
            if (accounts) {
                resolve(accounts)
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


   
exports.getAccountInfo = function(req) {
    return new Promise(function(resolve, reject) {

        Account.findOne({
            where: {
                Id: req.query.Id,
            }
        }).then((account)=> {
            if (account) {
                            
                let theAccount = {
                    Id: account.Id,
                    userName: account.userName,
                    firstName: account.firstName,
                    lastName: account.lastName,
                    authorityLevel: account.authorityLevel
                }
                resolve(theAccount)
            }
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}



exports.editAccountInfo = function(req) {
    return new Promise(function(resolve, reject) {
        Account.update({
            userName:   req.body.userName,
            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            birthYear:  req.body.birthYear,
            authorityLevel:req.body.authorityLevel,
            
        },
        {where: {Id: req.body.Id}}
        ).then((affectedAccounts) => {
            if (affectedAccounts > 0) {
                return resolve(affectedAccounts)
            }
            const error = {
                errors: [
                    {message: "No matches found."}
                ]
            }
            reject(error)
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.accountDelete = function(req) {
    return new Promise(function(resolve, reject) {

        Account.destroy({
            where: {
                Id: req.query.Id,
            }
        }).then((account)=> {
            if (account) {
                resolve()
            }
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors == null || error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}
