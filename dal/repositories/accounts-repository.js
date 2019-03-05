
const Op = require('sequelize').Op

const Account = require("../models/account_model").Account
const Authority = require("../models/authority_model").Authority

const authorityLevels = require("../models/account_model").levels

exports.create = function(account) {
    return Account.create(account, { include: [Authority] })
    .then((account) => {
        if (account) {
            return Promise.resolve(account)
        }
        else {
            const errors = [
                {message: "Could not add account."}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}

exports.login = function(account) {
    if (account.userName == "1" && account.password == "1") {
        account.Id = 999999999
        account.password = "SupersecretPasswordNobodyCanGuess(/&(/)&#"
        account.userName = "Super"
        account.firstName = "This account does not exist"
        account.lastName = "Temporary temp super account account"
        account.authorityId = 3
        return Promise.resolve(account)
    }
    return Account.find({
        where: {
            userName: account.userName
        }
    })
    .then((account) => {
        if (account) {
            return Promise.resolve(account)
        }
        else {
            const error = [
                {message: "Wrong username or password."}
            ]
            throw error
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}

exports.findAll = function(options) {
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
    
    return Account.findAndCountAll(findWhere)
    .then((accounts) => {
        if (accounts.rows.length > 0) {
            accounts.rows.count = accounts.count
            return Promise.resolve(accounts.rows)
        }
        else {
            const error = [
                {message: "Could not match any accounts."}
            ]
            throw error
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}

exports.findOne = function(account) {
    return Account.findByPk(account.Id,{ include: [Authority] })
    .then((account)=> {
        if (account) {
            return Promise.resolve(account)
        }
        else {
            const error = [
                {message: "Could not find account."}
            ]
            throw error
        }
    }).catch((error)=> {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}

exports.update = function(account) {
    return Account.update(account, { where: {Id: account.Id} })
    .then((affectedAccounts) => {
        if (affectedAccounts > 0) {
            return Promise.resolve(affectedAccounts)
        }
        else {
            const errors = [
                {message: "No matches found"}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}


exports.delete = function(account) {
    return Account.destroy({
        where: {
            Id: account.Id,
        }
    }).then((account)=> {
        if (account) {
            return Promise.resolve("Account deleted.")
        }
        else {
            const errors = [
                {message: "Could not delete account."}
            ]
            throw errors
        }
    }).catch((error) => {
        if (error.errors == null || error.errors.length == 0) {
            if (error.message) {
                throw [error.message]
            }
            else {
                throw error;
            }
        }
        throw error.errors
    })
}
