
const bcrypt = require("./functionality/bcrypt")

const accountRepository = require("../dal/repositories/accounts-repository")

const authorityLevel = require("../objects").authorityLevel

exports.create = async function(authorityId, account) {
    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    account.password = await bcrypt.encrypt(account.password)
    return accountRepository.create(account)
}

exports.login = async function(account) {

    const dbAccount = await accountRepository.login(account)
    if (dbAccount.userName == "Super" && dbAccount.password == "SupersecretPasswordNobodyCanGuess(/&(/)&#") {
        // for dev purpose.. remove this if / else upon release!
        return dbAccount
    }
    else {
        return bcrypt.compare(account.password, dbAccount)
    }
}

exports.findAll = function(authorityId, options) {
    if (authorityId == undefined) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return accountRepository.findAll(options)
}

exports.findByPk = function(authorityId, account) {
    if (authorityId == undefined) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return accountRepository.findByPk(account)
}


exports.update = async function(authorityId, account) {
    if (authorityId == undefined || (authorityId == authorityLevel.ADMIN &&
        (account.userName || account.firstName || account.lastName || account.authorityId))) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }
    else if (authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }
    
    if (account.password) {
        account.password = await bcrypt.encrypt(account.password)
    }
    else {
        delete account.password
    }
    return accountRepository.update(account)
}

exports.delete = function(authorityId, account) {

    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        return Promise.reject([{ message: "You do not have the permissions to do that." }])
    }

    return accountRepository.delete(account)
}
