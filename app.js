const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const requestHandler = require('./dal/request_handler')
const Sequelize = require('sequelize')

const mockData = require('./dal/mock_data').mockData

const createAccount = requestHandler.createAccount

const createBook = requestHandler.createBook
const searchBooks = requestHandler.searchBooks
const getBookInfo = requestHandler.getBookInfo


let Account
let Book
let BookAuthor // a join table
let Classification

let resetDatabase = true
const db = require('./dal/models')
db.init({
    force: resetDatabase
}).then((models) => {
    Account = models.Account,
    Author = models.Author
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
        message: "Hi!"
    }
]


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
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))


app.use(function(req, res, next) {
    if (!req.query) { req.query = { } }
    if (!req.query.title) {
        req.query.title = ""
    }
    if (!req.query.ISBN) {
        req.query.ISBN = ""
    }
    if (req.query.searchString) {
        req.query.searchString = req.query.searchString
    }
    else {
        req.query.searchString = ""
    }

    return next()
})

let mockDataUpdated = false
function initMockData() {
    if (mockDataUpdated) { return }
    if (!resetDatabase) { mockDataUpdated = true; return }
    mockDataUpdated = true

    
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
    Author.bulkCreate(mockData.authors)
    .then(function(authors) {
        
    }).catch(function(reason) {
        console.log("Couldn't initiate mockdata authors")
    })
}

app.use

app.get('/', function (req, res) {
    res.render("home.hbs")
})
app.get('/about', function (req, res) {
    new Promise(function (resolve, reject) {
        if (true) {
            resolve()
        }
        else {
            reject()
        }
    }).then(function () {

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
    .then(function (result) {
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


/*app.post('/books', function (req, res) {

    
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
*/
app.get('/books', function (req, res) {

    return searchBooks(req.query, Book)
    .then(function(books) {
        const model = {
            books: books
        }
        res.render(__dirname + "/views/books/books_list.hbs", model)
    })
    .catch(function(result) {
        res.render(__dirname + "/views/error.hbs", {message: result})
    })
})


app.get('/books_search', function (req, res) {

    res.render(__dirname + "/views/books/books_search.hbs")
})


app.get('/books/:ISBN', function (req, res) {
    
    return getBookInfo(req.params.ISBN, Book, Classification)
    .then(function(book) {
        res.render(__dirname + "/views/books/book_view.hbs", book)
    })
    .catch(function(result) {
        model = {
            message: result
        }
        res.render(__dirname + "/views/error.hbs", model)
    })
})

app.get('/books', function (req, res) {

    const bookname = req.query.SearchBox

    if (bookname == null || bookname == "") {
        const model = {
            posts: posts
        }
        res.render("./books/books_search.hbs", model)
    }
    else if (bookname != null) {
        const post = posts.find(p => p.name == bookname)

        const model = {
            post: post,
            bookname: bookname
        }
        res.render("./books/books_search.hbs", model)


    }
    else {
        const model = {
            posts: posts
        }
        res.render("./books/books_search.hbs", model)

    }
})

app.get('/books/:id', function (req, res) {
    const id = req.params.id
    const post = posts.find(p => p.id == id)
    
    model={
        post:post
    }
    res.render("./books/book_view.hbs",model)
})
app.get('/login', function (req, res) {
    
    res.render("./login.hbs")
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