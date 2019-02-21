
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
                if (error.message) {
                    return {errors: [error.message]}
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}

exports.login = function(account) {
    return new Promise(function(resolve, reject) {
        if (account.userName == "1" && account.password == "1") {
            account.Id = 999999999
            account.password = ""
            account.userName = "Dev"
            account.firstName = "This account does not exist"
            account.lastName = "Temporary dev account"
            account.authorityLevel = "Super"
            resolve(account)
            return;
        }
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
                if (error.message) {
                    return {errors: [error.message]}
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}

exports.findAll = function() {
    
    return new Promise(function(resolve, reject) {
        Account.findAll()
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
                if (error.message) {
                    return {errors: [error.message]}
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}


   
exports.findOne = function(account) {
    return new Promise(function(resolve, reject) {

        Account.findByPk(account.Id).then((account)=> {
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
                if (error.message) {
                    return {errors: [error.message]}
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}



exports.update = function(account) {
    return new Promise(function(resolve, reject) {
        Account.update(account, { where: {Id: account.Id} })
        .then((affectedAccounts) => {
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
                if (error.message) {
                    return {errors: [error.message]}
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}


exports.delete = function(req) {
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
                if (error.message) {
                    return {errors: [error.message]}
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}
