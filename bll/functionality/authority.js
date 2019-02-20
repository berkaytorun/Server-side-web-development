
exports.canDeleteBooks = function(authority) {
    if (authority === "Admin" || authority === "Super") {
        return true
    }
    return false
}

exports.canDeleteAuthors = function(authority) {
    if (authority === "Admin" || authority === "Super") {
        return true
    }
    return false
}
exports.canDeleteUsers = function(authority) {
    if (authority === "Super") {
        return true
    }
    return false
}
