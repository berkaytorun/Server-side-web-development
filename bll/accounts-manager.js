
const bcrypt = require("./functionality/bcrypt")

const accountRepository = require("../dal/repositories/accounts-repository")

const authorityLevel = require("../objects").authorityLevel

exports.create = function(authorityId, account) {
    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return bcrypt.encrypt(account.password)
    .then(function(hashedPassword) {
        account.password = hashedPassword
        return accountRepository.create(account)
    })
}

exports.login = function(account) {
    return accountRepository.login(account)
    .then(function(dbAccount) {
        if (dbAccount.userName == "Super" && dbAccount.password == "SupersecretPasswordNobodyCanGuess(/&(/)&#") {
            // for dev purpose.. remove this if / else upon release!
            return Promise.resolve(dbAccount)
        }
        else {
            return bcrypt.compare(account.password, dbAccount)
        }
    })
}

exports.findAll = function(authorityId, options) {
    if (authorityId == undefined) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return accountRepository.findAll(options)
}

exports.findOne = function(authorityId, account) {
    if (authorityId == undefined) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return accountRepository.findOne(account)
}


exports.update = function(authorityId, account) {
    if (authorityId == undefined || (authorityId == authorityLevel.ADMIN &&
        (account.userName || account.firstName || account.lastName || account.authorityId))) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }
    else if (authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return bcrypt.encrypt(account.password)
    .then(function(hashedPassword) {
        if (hashedPassword == "") {
            delete account.password
        }
        else {
            account.password = hashedPassword
        }
        return accountRepository.update(account)
    })
}

exports.delete = function(authorityId, account) {

    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return accountRepository.delete(account)
}
