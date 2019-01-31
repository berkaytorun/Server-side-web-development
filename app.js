const express = require("express")
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")
const requestHandler = require("./dal/request_handler")

const mockData = require("./dal/mock_data").mockData

const createAccount = requestHandler.createAccount

const app = express()

app.use(express.static("public"))

// used for debugging.. using mock data
// remove before release!
app.use(function(req, res, next) {
    initMockData();
    req.mockData = mockData
    return next()
})

app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: __dirname + "/pl/views/layouts"
}))

app.set("views", __dirname + "/pl/views/")


let Account
let Author
let Book
const routerBooks = require("./pl/routers/books-router")
let BookAuthor // a join table
let Classification

let resetDatabase = true
const db = require("./dal/models")
db.init({
    force: resetDatabase
}).then((models) => {
    Account = models.Account
    Author = models.Author
    Book = models.Book
    BookAuthor = models.BookAuthor
    Classification = models.Classification
}).catch(reason => {
    console.log("Check init for DB! DB not working!")
})

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
    
    req.models = {
        Account: Account,
        Author: Author,
        Book: Book,
        BookAuthor: BookAuthor,
        Classification: Classification
    }

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

    Author.bulkCreate(mockData.authors)
    .then(function(authors) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata authors")
    })
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