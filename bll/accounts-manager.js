
const bcrypt = require("./functionality/bcrypt")

const dal = require("../dal/repositories/accounts-repository")

const authority = require("./functionality/authority")

exports.create = function(authorityId, account) {
    return new Promise(function(resolve, reject) {
        
        const SUPER = 3
        if (!(authorityId >= SUPER)) {
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
            if (dbAccount.userName == "Dev" && dbAccount.password == "") {
                return new Promise(function(resolve, reject ) { resolve(dbAccount) })
            }
            else {
                return bcrypt.compare(account.password, dbAccount)
            }
        }).then(function(account) {

            session.accountId = account.Id
            session.authorityId = account.authorityId

            session.loggedIn = true
            session.userName = account.userName

            resolve(account)

        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.findAll = function(authorityId, options) {
    return new Promise(function(resolve, reject) {

        if (authorityId == undefined) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

        return dal.findAll(options)
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
            // Destroy this session
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}

exports.findOne = function(authorityId, account) {
    return new Promise(function(resolve, reject) {
        
        if (authorityId == undefined) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

        return dal.findOne(account)
        .then(function(accountInfo) {
            resolve(accountInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}


exports.update = function(authorityId, account) {
    return new Promise(function(resolve, reject) {

        const ADMIN = 2
        const SUPER = 3
        if (authorityId == ADMIN &&
                (account.userName ||
                account.firstName ||
                account.lastName ||
                account.authorityLevel)) {
            throw [{ message: "You do not have the permissions to do that." }]
        }
        else if (!(authorityId >= SUPER)) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

        bcrypt.encrypt(account.password)
        .then(function(hashedPassword) {
            account.password = hashedPassword
            return dal.update(account)
        }).then(function(accounts) {
            resolve(accounts)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.delete = function(authorityId, account) {
    return new Promise(function(resolve, reject) {
        
        if (authorityId < SUPER) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

        return dal.delete(account)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}
