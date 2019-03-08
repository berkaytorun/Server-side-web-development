
const passwordHasher = require("bcryptjs")

exports.encrypt = function(stringToHash) {
    return new Promise(function(resolve, reject) {
        passwordHasher.genSalt(10, function(error, salt) {
            passwordHasher.hash(stringToHash, salt, function(error, hashedString) {
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
        passwordHasher.compare(password, passwordObject.password)
        .then(function(success) {
            if (!success) {
                reject (error=[
                    {message:"Wrong username or password"}
                ])
            }
            resolve(passwordObject)
        }).catch(function(error) {
            reject(error)
        })
    })
}