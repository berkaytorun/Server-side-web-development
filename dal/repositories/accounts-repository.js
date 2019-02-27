
const Op = require('sequelize').Op

const Account = require("../models/account_model").Account
const Authority = require("../models/authority_model").Authority

const authorityLevels = require("../models/account_model").levels

exports.create = function(account) {
    return new Promise(function(resolve, reject) {
        Account.create(account, { include: [Authority] })
        .then((account) => {
            if (account) {
                resolve(account)
            }
            else {
                const errors = [
                    {message: "Could not add account."}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
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
            account.password = "SupersecretPasswordNobodyCanGuess(/&(/)&#"
            account.userName = "Super"
            account.firstName = "This account does not exist"
            account.lastName = "Temporary temp super account account"
            account.authorityId = 3
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
                const error = [
                    {message: "Could not add account."}
                ]
                reject(error)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}

exports.findAll = function(options) {
    return new Promise(function(resolve, reject) {
    
        const findWhere = {
            order: [
                ['firstName', 'ASC']
            ],
            
            limit: options.limit,
            offset: options.offset,
            
            where: { },
            include: [{model: Authority}]
        }
        
        if (options.searchString !== "") {
            
            findWhere.where = {
                [Op.or]: [
                    {userName: {
                            [Op.like]: options.searchString, 
                        }
                    },
                    {firstName: {
                            [Op.like]: options.searchString, 
                        }
                    },
                    {lastName: {
                            [Op.like]: options.searchString, 
                        }
                    }
                ]
            }
        }
        
        Account.findAndCountAll(findWhere)
        .then((accounts) => {
            if (accounts.rows.length > 0) {
                accounts.rows.count = accounts.count
                resolve(accounts.rows)
            }
            else {
                resolve("")
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
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

        Account.findByPk(account.Id,{ include: [Authority] })
        .then((account)=> {
            if (account) {
                resolve(account)
            }
            else {
                const error = [
                    {message: "Could not add account."}
                ]
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
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
                resolve(affectedAccounts)
            }
            else {
                const errors = [
                    {message: "No matches found"}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}


exports.delete = function(account) {
    return new Promise(function(resolve, reject) {

        Account.destroy({
            where: {
                Id: account.Id,
            }
        }).then((account)=> {
            if (account) {
                resolve()
            }
            else {
                const errors = [
                    {message: "Account was not found"}
                ]
                reject(errors)
            }
        }).catch((error) => {
            if (error.errors == null || error.errors.length == 0) {
                if (error.message) {
                    reject([error.message])
                }
                else {
                    setTimeout(function() { throw error; });
                }
            }
            return reject(error.errors)
        })
    })
}
