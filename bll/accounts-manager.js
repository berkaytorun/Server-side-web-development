
const bcrypt = require("./functionality/bcrypt")

const dal = require("../dal/repositories/accounts-repository")

const authority = require("./functionality/authority")

exports.create = function(session, account) {
    return new Promise(function(resolve, reject) {
        
        if (!authority.canCreateAccounts(session)) {
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



exports.login = function(session, account) {
    return new Promise(function(resolve, reject) {

        return dal.login(account)
        .then(function(dbAccount) {
            return bcrypt.compare(account.password, dbAccount)
        }).then(function(account) {

            session.accountId = account.Id
            session.authorityLevel = account.authorityLevel

            session.loggedIn = true
            session.userName = account.userName

            session.canDeleteBooks = authority.canDeleteBooks(session)
            session.canDeleteAuthors = authority.canDeleteAuthors(session)
            session.canDeleteAccounts = authority.canDeleteAccounts(session)
            session.canUpdateBooks = authority.canUpdateBooks(session)
            
            resolve(account)

        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findAll = function(session) {
    return new Promise(function(resolve, reject) {

        if (!authority.canReadAccounts(session)) {
            throw {errors: [{ message: "You do not have the permissions to do that." }]}
        }

        return dal.findAll()
        .then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.logout = function(session) {
    return new Promise(function(resolve, reject) {
        session.destroy(function(err) {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}

exports.findOne = function(session, query) {
    return new Promise(function(resolve, reject) {
        
        if (!authority.canReadAccounts(session)) {
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
        
        if (!authority.canUpdateAccounts(session)) {
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
        
        if (!authority.canDeleteAccounts(session)) {
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
