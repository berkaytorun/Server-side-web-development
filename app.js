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
    if (!req.query.searchString) {
        req.query.searchString = ""
    }
    if (!req.query.limit) {
        req.query.limit = 20
    }
    if (!req.query.page) {
        req.query.page = 1
    }
    req.query.offset = (req.query.page - 1) * req.query.limit

    return next()
})

let mockDataUpdated = true
function initMockData() {
    if (!resetDatabase || !mockDataUpdated) {
        return 
    }
    mockDataUpdated = false

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


app.get('/', function (req, res) {
    res.render(__dirname + "/views/home.hbs")
})

app.post('/accounts', function (req, res) {
    
    req.body = {
        userName: "The username",
        password: "my password"
    }
    return createAccount(req, Account)
    .then(function (result) {
        const model = {
            posts: [result]
        }
        res.render("/views/books/books_search.hbs", model)

    }).catch(function(result) {
        res.render(__dirname + "/views/error.hbs")
    })
})

app.get('/signup', function (req, res) {

    return createAccount(req, Account)
    .then(function (result) {
        const model = {
            posts: [result]
        }
        res.render("/views/books/books_search.hbs", model)

    }).catch(function(result) {
        res.render(__dirname + "/views/error.hbs")
    })
})

app.get('/login', function (req, res) {

    res.render(__dirname + "/views/accounts/login.hbs")
})

/*
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
*/

function createPagesNumbers(totalPages, currentPage) {
    totalPages = Math.round(totalPages + 0.5)
    const pagesArray = []
    const pagesClip = 5
    if (totalPages > 10) {
        for (let i = 1; i <= pagesClip; i++) {
            if (currentPage == i) {
                pagesArray.push({hasValue: true, value: i, isCurrent: true})
            }
            else {
                pagesArray.push({hasValue: true, value: i, isCurrent: false})
            }
        }
        pagesArray.push({hasValue: false})
        for (let i = totalPages - pagesClip + 1; i <= totalPages; i++) {
            if (currentPage == i) {
                pagesArray.push({hasValue: true, value: i, isCurrent: true})
            }
            else {
                pagesArray.push({hasValue: true, value: i, isCurrent: false})
            }
        }
    }
    else {
        for (let i = 1; i < totalPages; i++) {
            if (currentPage == i) {
                pagesArray.push({hasValue: true, value: i, isCurrent: true})
            }
            else {
                pagesArray.push({hasValue: true, value: i, isCurrent: false})
            }
        }
    }
    return pagesArray
}

app.get('/books', function (req, res) {

    return searchBooks(req.query, Book)
    .then(function(books) {
        
        const totalPages = (books.total) / req.query.limit
        books.pages = createPagesNumbers(totalPages, req.query.page)
        books.searchString = req.query.searchString


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



app.listen(8080)