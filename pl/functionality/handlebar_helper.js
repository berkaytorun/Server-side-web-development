
module.exports = {
    isSuper: function(v1, options){
        if(v1 >= 3){
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    isAdmin: function(v1, options){
        if(v1 >= 2){
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    },
    isMod: function(v1, options){
        if(v1 >= 1){
            return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
    }
}