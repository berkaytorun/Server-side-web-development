
exports.canCreateBooks = function(authority) {
    if (authority.authorityLevel === "Moderator" || authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canUpdateBooks = function(authority) {
    if (authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canDeleteBooks = function(authority) {
    if (authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}



exports.canCreateAuthors = function(authority) {
    if (authority.authorityLevel === "Moderator" || authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canUpdateAuthors = function(authority) {
    if (authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canDeleteAuthors = function(authority) {
    if (authority.authorityLevel === "Super") {
        return true
    }
    return false
}




exports.canCreateAccounts = function(authority) {
    if (authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canReadAccounts = function(authority) {
    if (authority.authorityLevel === "Moderator" || authority.authorityLevel === "Admin" || authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canDeleteAccounts = function(authority) {
    if (authority.authorityLevel === "Super") {
        return true
    }
    return false
}
exports.canUpdateAccounts = function(authority) {
    if (authority.authorityLevel === "Super") {
        return true
    }
    return false
}
