
const bcrypt = require("./functionality/bcrypt")

const accountRepository = require("../dal/repositories/accounts-repository")

exports.create = function(authorityId, account) {
    return new Promise(function(resolve, reject) {
        
        const SUPER = 3
        if (authorityId < SUPER) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

        bcrypt.encrypt(account.password)
        .then(function(hashedPassword) {
            account.password = hashedPassword
            return accountRepository.create(account)
        }).then(function(account) {

            resolve(account)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.login = function(account) {
    return new Promise(function(resolve, reject) {

        return accountRepository.login(account)
        .then(function(dbAccount) {
            if (dbAccount.userName == "Dev" && dbAccount.password == "") {
                // for dev purpose.. remove this if / else upon release!
                return new Promise(function(resolve, reject ) { resolve(dbAccount) })
            }
            else {
                return bcrypt.compare(account.password, dbAccount)
            }
        }).then(function(account) {
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

        return accountRepository.findAll(options)
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

        return accountRepository.findOne(account)
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
        if (authorityId == undefined || (authorityId < SUPER &&
            (account.userName || account.firstName || account.lastName || account.authorityId)
            )
                ) {
            throw [{ message: "You do not have the permissions to do that." }]
        }
        else if (authorityId < ADMIN) {
            throw [{ message: "You do not have the permissions to do that." }]
        }

        bcrypt.encrypt(account.password)
        .then(function(hashedPassword) {
            if (hashedPassword == "") {
                delete account.password
            }
            else {
                account.password = hashedPassword
            }
            return accountRepository.update(account)
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

        return accountRepository.delete(account)
        .then(function() {
            resolve()
        }).catch(function(error) {
            reject(error)
        })
    })
}
