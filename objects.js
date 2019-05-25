exports.databaseInfo = {
    databaseName: 'librarytooldatabase',
port: 3306,
login: 'master',
password: 'mypassword',
host: 'librarytooldatabase.cycci93lc4hk.eu-central-1.rds.amazonaws.com',
dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

exports.authorityLevel = {
    MODERATOR: 1,
    ADMIN: 2,
    SUPER: 3
}
