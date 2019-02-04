
const Sequelize = require('sequelize')

const db = new Sequelize('joyl', 'joyl', 'joyljoyl', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    //operatorsAliases: false,
    storage: __dirname + '/database.sqlite'
})
exports.Sequelize = Sequelize
exports.db = db

let resetDatabase = true
require("./database").initRelations()

db.sync({force: resetDatabase})
.then(function(result) {
    if (resetDatabase) {
        require("./database").initMockData()
    }
}).catch(function(error) {
    console.log(error)
})
