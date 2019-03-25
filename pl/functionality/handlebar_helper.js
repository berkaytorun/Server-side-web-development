
module.exports = {
    isSuper: function(authorityId, options){
        if(authorityId == 3) {
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    hasSuperRights: function(authorityId, options){
        if(authorityId >= 3) {
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    isNotSuper: function(authorityId, options){
        if(authorityId != 3) {
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    hasAdminRights: function(authorityId, options){
        if(authorityId >= 2) {
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    isAdmin: function(authorityId, options){
        if(authorityId == 2) {
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    isNotAdmin: function(authorityId, options){
        if(authorityId != 2) {
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    hasModeratorRights: function(authorityId, options){
        if(authorityId >= 1){
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    isDots: function(value, options){
        if(value == "..."){
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    }
}