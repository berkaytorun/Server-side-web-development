
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

let resetDatabase = false

require("./database").initRelations()
if (resetDatabase == false) { return resetDatabase }

db.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function(results) {
    return db.sync({force: true})
}).then(function(result) {
    require("./database").initMockData(db)
    /*
    db.query('show tables')
    .then((allTables) => {
    console.log(allTables);
    })
    */
    let delayTimer = 1000
    if (resetDatabase == false) { delayTimer = 0 }
    setTimeout(function() {
        db.query('SET FOREIGN_KEY_CHECKS = 1')
    }, delayTimer)
    return resetDatabase
}).catch(function(error) {
    console.log(error)
})
