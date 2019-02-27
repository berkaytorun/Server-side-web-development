
const bcrypt = require("bcryptjs")
const errorHandler = require("../../error_handler")

exports.encrypt = function(stringToHash) {
    return new Promise(function(resolve, reject) {
        if (stringToHash == "") {
            // password not changed
            resolve(stringToHash)
        }
        bcrypt.genSalt(10, function(error, salt) {
            bcrypt.hash(stringToHash, salt, function(error, hashedString) {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(hashedString)
                }
            })
        })
    })
}

exports.compare = function(password, passwordObject) {
    return new Promise(function(resolve, reject) {
        // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
        bcrypt.compare(password, passwordObject.password)
        .then(function(success) {
            if (!success) {
                throw (errorHandler.handle("Wrong username or password"))
            }
            resolve(passwordObject)
        }).catch(function(error) {
            reject(error)
        })
    })
}