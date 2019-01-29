const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const requestHandler = require('./dal/request_handler')
const Sequelize = require('sequelize')

const mockData = require('./dal/mock_data').mockData

const createAccount = requestHandler.createAccount
const createBook = requestHandler.createBook
const getBook = requestHandler.getBook
const getBooks = requestHandler.getBooks


let Account
let Book
let BookAuthor
let Classification

const db = require('./dal/models')
db.init({
    force: true
}).then((models) => {
    Account = models.Account,
    Book = models.Book,
    BookAuthor = models.BookAuthor,
    Classification = models.Classification
}).catch(reason => {
    console.log("Check init for DB! DB not working!")
})

const posts = [
    {
        id: 1,
        name: "Alice",
        message: "Great website!"
    }, {
        id: 2,
        name: "Bob",
        message: "Hello!"
    }, {
        id: 3,
        name: "Claire",
        message: "Hi!"
    }, {
        id: 4,
        name: "Claire",
        message: "Hi!sss"
    }
]


const app = express()

app.use(express.static("public"))

// used for debugging.. using mock data
// remove before release!
app.use(function(req, res, next) {
    createMockups();
    req.mockData = mockData
    return next()
})


app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }
    if (!req.query.title) {
        req.query.title = ""
    }
    if (!req.query.ISBN) {
        req.query.ISBN = ""
    }

    return next()
})

app.use(bodyParser.urlencoded({
    extended: false
}))
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

let mockCreated = false
function createMockups() {
    if (mockCreated) { return }
    Book.bulkCreate(mockData.books)
    .then(function(books) {
        mockCreated = true
    }).catch(function() {
        console.log("Couldn't initiate mockdata.")
    })
}

app.use

app.get('/', function (req, res) {
    res.render("home.hbs")
})
app.get('/about', function (req, res) {
    new Promise(function(resolve, reject) {
        if (true) {
            resolve()
        }
        else {
            reject()
        }
    }).then(function() {
        
        res.render("./about.hbs")
    }).catch(result => {
        res.status(res.status).json(res)
    })
})


app.get('/signup', function (req, res) {
    
    req.body = {
        userName: "The username",
        password: "my password"
    }
    return createAccount(req, Account)
    .then(function(result) {
        
        const model = {
            posts: [result]
        }
        res.render("books/books_search.hbs", model)

    }).catch(function(result) {
        res.render(__dirname + "/views/error.hbs")
    })
})



app.get('/login', function (req, res) {

    res.render("login.hbs")
})


app.post('/books', function (req, res) {
    
    return createBook(req, Book)
    .then(function(result) {
        const model = {
            posts: [result]
        }
        res.render(__dirname + "/views/booksCreated.hbs")
    })
    .catch(function(result) {
        res.render(__dirname + "/views/error.hbs")
    })
})

app.get('/books', function (req, res) {

    return getBooks(req, Book)
    .then(function(books) {
        const model = {
            books: books
        }
        res.render(__dirname + "/views/books/books_search.hbs", model)
    })
    .catch(function(result) {
        res.render(__dirname + "/views/error.hbs")
    })
})

app.get('/books/:id', function (req, res) {
    req.query.ISBN = req.params.id
    return getBook(req, Book, Classification)
    .then(function(book) {
        const model = {
            book: book
        }
        res.render(__dirname + "/views/books/book_view.hbs", book)
    })
    .catch(function(result) {
        res.render(__dirname + "/views/error.hbs")
    })

})

/*
app.update('/books/:id', function (req, res) {

    res.render("login.hbs")
})
app.delete('/books/:id', function (req, res) {
    
    res.render("login.hbs")
})
*/



app.listen(8080)