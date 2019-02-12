const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")

const app = express()

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

// Setup req object
app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }

    if (!req.query.searchString) {
        req.query.searchString = ""
    }
    if (!req.query.limit) {
        req.query.limit = 20
    }
    if (!req.query.currentPage) {
        req.query.currentPage = 1
    }
    req.query.offset = (req.query.currentPage - 1) * req.query.limit

    return next()
})

const resetDatabase = require("./dal/sequelize_settings")
let startDelay = 0;
if (resetDatabase) { startDelay = 3000 }

setTimeout(function() {
    // delay this part, until db is done.
    const routerAccounts
    const routerBooks = require("./pl/routers/books-router")
    const routerAuthors = require("./pl/routers/authors-router")
    
    app.use("/books", routerBooks)
    app.use("/authors", routerAuthors)
    
    app.get("/home", function (req, res) {
        res.render("home.hbs")
    })

    app.post("/accounts", function (req, res) {
        
        req.body = {
            userName: "The username",
            password: "my password"
        }
        return createAccount(req, Account)
        .then(function (result) {
            const model = {
                posts: [result]
            }
            res.render("books/books_search.hbs", model)

        }).catch(function(result) {
            res.render("error.hbs")
        })
    })

    app.get("/signup", function (req, res) {

        return createAccount(req, Account)
        .then(function (result) {
            const model = {
                posts: [result]
            }
            res.render("books/books_search.hbs", model)

        }).catch(function(result) {
            res.render("error.hbs")
        })
    })

    app.get("/login", function (req, res) {

        res.render("accounts/login.hbs")
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

            res.render("about.hbs")
        }).catch(result => {
            res.status(res.status).json(res)
        })
    })

    app.listen(8080)

}, startDelay)
