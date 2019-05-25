
const dbInfo = require("../objects").databaseInfo

const Sequelize = require('sequelize')

const db = new Sequelize(dbInfo.databaseName, dbInfo.login, dbInfo.password, {
    host: dbInfo.host,
    dialect: dbInfo.dialect,
    operatorsAliases: dbInfo.operatorsAliases,

    pool: dbInfo.pool
})
exports.Sequelize = Sequelize
exports.db = db

// CAUTION !
// resetDatabase = true means it deletes all tables and resets everything.
// use at own risk!!
let resetDatabase = true
let delayTimer = 0

require("./database").initRelations()
if (resetDatabase == false) { return delayTimer }

db.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function(results) {
    return db.sync({force: true})
}).then(function(result) {
    require("./database").initMockData(db)
    delayTimer = 1000
    if (resetDatabase == false) { delayTimer = 0 }
    setTimeout(function() {
        db.query('SET FOREIGN_KEY_CHECKS = 1')

        const accountManager = require("../bll/accounts-manager")
        
        const superAccount = {
            userName: "1",
            password: "1",
            firstName: "Super",
            lastName: "None",
            authorityId: 3
        }

        accountManager.create(3, superAccount)

    }, delayTimer)
    return delayTimer
}).catch(function(error) {
    console.log(error)
})
