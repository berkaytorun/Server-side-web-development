const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const requestHandler = require('./dal/request_handler')

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
    Account = models.Account
    Author = models.Author
    Book = models.Book
    BookAuthor = models.BookAuthor
    Classification = models.Classification
}).catch(reason => {
    console.log("Check init for DB! DB not working!")
})

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
    extname: '.hbs',
    layoutsDir: __dirname + "/pl/views/layouts"
}))

app.set("views", __dirname + "/pl/views/")

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
    res.render("home.hbs")
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
        res.render("books/books_search.hbs", model)

    }).catch(function(result) {
        res.render("error.hbs")
    })
})

app.get('/signup', function (req, res) {

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

app.get('/login', function (req, res) {

    res.render("accounts/login.hbs")
})

/*
app.post('/books', function (req, res) {
    
    return createBook(req, Book)
    .then(function(result) {
        const model = {
            posts: [result]
        }
        res.render("booksCreated.hbs")
    })
    .catch(function(result) {
        res.render("error.hbs")
    })
})
*/

function createPagesNumbers(totalPages, currentPage) {
    currentPage = Number(currentPage)

    totalPages = Math.ceil(totalPages)

    const pagesArray = []
    const pagesClip = 5

    const firstPage = 1
    const lastPage = totalPages
    
    let start = currentPage <= pagesClip ? firstPage : currentPage - pagesClip
    let end = currentPage <= pagesClip ? (pagesClip * 2) + 1 : currentPage + pagesClip 
    if (end > lastPage) {
        end = lastPage
        start = end - (pagesClip * 2)
        start = start < 1? 1 : start
    }

    let hasFirstPage = start == firstPage

    if (!hasFirstPage) {
        pagesArray.push({value: firstPage, isFirstPage: true})
    }
    for (let i = start; i <= end; i++) {
        if (i == currentPage) {
            pagesArray.push({value: i, isCurrent: true})
        }
        else {
            pagesArray.push({value: i, isCurrent: false})
        }
    }
    
    let hasLastPage = end == lastPage
    if (!hasLastPage) {
        pagesArray.push({value: lastPage, isLastPage: true})
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
        res.render("books/books_list.hbs", model)
    })
    .catch(function(result) {
        res.render("error.hbs", {message: result})
    })
})


app.get('/books_search', function (req, res) {

    res.render("books/books_search.hbs")
})

app.get('/books/:ISBN', function (req, res) {
    
    return getBookInfo(req.params.ISBN, Book, Classification)
    .then(function(book) {
        res.render("books/book_view.hbs", book)
    })
    .catch(function(result) {
        model = {
            message: result
        }
        res.render("error.hbs", model)
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

        res.render("about.hbs")
    }).catch(result => {
        res.status(res.status).json(res)
    })
})



app.listen(8080)