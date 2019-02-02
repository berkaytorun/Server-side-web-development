const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")

const mockData = require("./dal/mock_data").mockData

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

require("./dal/models/relationships").init()

/* */
let resetDatabase = true
require("./dal/sequelize_settings").db
.sync({force: resetDatabase})
.then(function(result) {
    console.log(result)
}).catch(function(error) {
    console.log(error)
})
/* */

// used for debugging.. using mock data
// remove before release!
app.use(function(req, res, next) {
    initMockData();
    req.mockData = mockData
    return next()
})

const routerBooks = require("./pl/routers/books-router")

// Setup req object
app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }

    if (!req.query.title) {
        req.query.title = ""
    }
    if (!req.query.ISBN) {
        req.query.ISBN = ""
    }
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

let mockDataUpdated = true
function initMockData() {
    if (!mockDataUpdated) {
        return 
    }
    mockDataUpdated = false
    if (!resetDatabase) {
        return
    }

    let Author = require("./dal/models/author_model").Author
    let Book = require("./dal/models/book_model").Book
    let Classification = require("./dal/models/classification_model").Classification

    /* */
    Author.bulkCreate(mockData.authors)
    .then(function(authors) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata authors")
    })
    /* */
    Classification.bulkCreate(mockData.classifications)
    .then(function(classifications) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata classifications")
    })
    Book.bulkCreate(mockData.books)
    .then(function(books) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata books")
    })
}


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

app.use("/books", routerBooks)

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