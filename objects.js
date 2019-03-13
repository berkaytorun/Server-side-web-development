exports.databaseInfo = {
    databaseName: 'projectGroupN',
    port: 3306,
    login: 'groupN',
    password: 'lkjwmnmnfsdlk',
    host: 'petersmysql.cgonxecdluoj.eu-west-1.rds.amazonaws.com',
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