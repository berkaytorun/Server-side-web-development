const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")
var session = require('express-session')

const app = express()

const MS = 1000
const SEC = 15
const MIN = 15
const HOUR = 0

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    store: "",
    secret: 'keyboard cat',
    resave: false,
    rolling:true,
    saveUninitialized: true,
    cookie: {maxAge: 
        (MS * SEC) + 
        (MS * 60 * MIN) +
        (MS * 60 * 60 * HOUR)
    }
}))

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: __dirname + "/pl/views/layouts",
    partialsDir:__dirname + "/pl/views/partials"
}))

app.set("views", __dirname + "/pl/views/")


// Access the session as req.session
app.get('/', function(req, res, next) {
})

// Setup req object
app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }

    if (!req.query.searchString) { req.query.searchString = "" }

    if (!req.query.limit) { req.query.limit = 20 }

    if (!req.query.currentPage) { req.query.currentPage = 1 }

    req.query.offset = (req.query.currentPage - 1) * req.query.limit

    return next()
})

const startDelay = require("./dal/sequelize_settings")

setTimeout(function() {
    // delay this part, until db is done.
    const routerAccounts = require("./pl/routers/accounts-router")
    const routerBooks = require("./pl/routers/books-router")
    const routerAuthors = require("./pl/routers/authors-router")
    
    app.use("/accounts", routerAccounts)
    app.use("/books", routerBooks)
    app.use("/authors", routerAuthors)
    
    app.get("/home", function (req, res) {
        const model = {
            accountId: req.session.accountId,
            session: req.session
        }
        res.render("home.hbs",model)
    })  

    app.get("/about", function (req, res) {
        new Promise(function (resolve, reject) {
            if (true) {
                resolve()
            }
            else {
                reject()
            }
        }).then(function () {
            const model = {
<<<<<<< HEAD
                session: req.session
            }
            res.render("about.hbs", model)
=======
                accountId: req.session.accountId,
                session: req.session
            }
            res.render("about.hbs",model)
>>>>>>> sessions
        }).catch(result => {
            res.status(res.status).json(res)
        })
    })

    app.listen(8080)

}, startDelay)
