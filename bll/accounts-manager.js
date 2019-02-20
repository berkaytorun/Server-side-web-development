
const bcrypt = require("./functionality/bcrypt")

const dal = require("../dal/repositories/accounts-repository")

exports.create = function(session, account) {
    return new Promise(function(resolve, reject) {
        const allowedLevels = [
            "Admin",
            "Super"
        ]
        if (allowedLevels.includes(session.authorityLevel) == false) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

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
exports.login = function(account, session) {
    return new Promise(function(resolve, reject) {

        return dal.login(account)
        .then(function(dbAccount) {
            return bcrypt.compare(account.password, dbAccount)
        }).then(function(account) {

            session.accountId = account.Id
            session.authorityLevel = account.authorityLevel
            
            resolve(account)

        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findAll = function(options) {
    return new Promise(function(resolve, reject) {

        const allowedLevels = [
            "Super"
        ]
        if (allowedLevels.includes(session.authorityLevel) == false) {
            throw {errors: [{ message: "You do not have the permissions to do that." }]}
        }

        return dal.findAll(options)
        .then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.findOne = function(session, query) {
    return new Promise(function(resolve, reject) {

        const allowedLevels = [
            "Super"
        ]
        if (allowedLevels.includes(session.authorityLevel) == false) {
            throw {errors: [{ message: "You do not have the permissions to do that." }]}
        }

        return dal.findOne(query)
        .then(function(accountInfo) {
            resolve(accountInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.update = function(session, account) {
    return new Promise(function(resolve, reject) {

        const allowedLevels = [
            "Super"
        ]
        if (allowedLevels.includes(session.authorityLevel) == false) {
            throw {errors: [{ message: "You do not have the permissions to do that." }]}
        }

        return dal.update(account)
        .then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.delete = function(req) {
    return new Promise(function(resolve, reject) {

        const allowedLevels = [
            "Super"
        ]
        if (allowedLevels.includes(session.authorityLevel) == false) {
            throw {errors: [{ message: "You do not have the permissions to do that." }]}
        }

        return dal.delete(req)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}
