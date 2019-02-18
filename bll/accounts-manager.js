
const bcrypt = require("./functionality/bcrypt")

const dal = require("../dal/repositories/accounts-repository")

exports.create = function(account) {
    return new Promise(function(resolve, reject) {
        bcrypt.encrypt(account.password)
        .then(function(hashedPassword) {
            account.password = hashedPassword
            return dal.create(account)
        }).then(function(account) {
            resolve(account)
        }).catch(function(error) {
            reject(error)
        })
    })
}
exports.login = function(account) {
    return new Promise(function(resolve, reject) {

        return dal.login(account)
        .then(function(dbAccount) {
            return bcrypt.compare(account.password, dbAccount.password)
        }).then(function(success) {
            
        }).then(function(result) {
            resolve(result)
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


exports.getAccountInfo = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.getAccountInfo(req)
        .then(function(accountInfo) {
            resolve(accountInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.editAccountInfo = function(req) {
    return new Promise(function(resolve, reject) {

        return dal.editAccountInfo(req)
        .then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.accountDelete = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.accountDelete(req)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}
