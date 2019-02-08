
const Sequelize = require('sequelize')

const db = new Sequelize('projectGroupN', 'groupN', 'lkjwmnmnfsdlk', {
    host: 'petersmysql.cgonxecdluoj.eu-west-1.rds.amazonaws.com',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
exports.Sequelize = Sequelize
exports.db = db

let resetDatabase = true
require("./database").initRelations()

db.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function(results) {
    return db.sync({force: true})
}).then(function(result) {
    if (resetDatabase) {
        require("./database").initMockData(db)
    }
    /*
    db.query('show tables')
    .then((allTables) => {
        console.log(allTables);
    })
    */
    setTimeout(function() {
        db.query('SET FOREIGN_KEY_CHECKS = 1')
    }, 10000)
}).catch(function(error) {
    console.log(error)
})
