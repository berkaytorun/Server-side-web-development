const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const requestHandler = require('./dal/request_handler')

const mockData = require('./dal/mock_data').mockData

const createAccount = requestHandler.createAccount
const createBook = requestHandler.createBook
const getBooks = requestHandler.getBooks


var Account
var Book
const db = require('./dal/models')
db.init({
    force: true
}).then((models) => {
    Account = models.Account,
    Book = models.Book
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
        console.log("blaj");
    })
})



app.get('/login', function (req, res) {

    res.render("login.hbs")
})


app.post('/books', function (req, res) {
    
    return createBook(req, Book)
    .then(function(result) {
        
        return getBooks(req, Book);

    }).then(function(result) {
        const model = {
            posts: [result]
        }
        res.render("books/books_search.hbs", model)
    })
    .catch(function(result) {
        res.status(500).end("Error");
    })
    
    req.body = {
        userName: "The username",
        password: "my password"
    }

    return createBook(req, Book)
    .then(function(result) {
        
        const model = {
            posts: [result]
        }
        res.render("books/books_search.hbs", model)

    }).catch(function(result) {
        console.log("blaj");
    })
})

app.get('/books', function (req, res) {

    return createBook(req, Book)
    .then(function(result) {
        
        return getBooks(req, Book);

    }).then(function(books) {
        const model = {
            books: books
        }
        res.render(__dirname + "/views/books/books_search.hbs", model)
    })
    .catch(function(result) {
        res.status(500).end("Error");
    })
})

app.get('/books/:id', function (req, res) {
    
    return createBook(req, Book)
    .then(function(result) {
        
        const model = {
            posts: [result]
        }
        res.render("books/books_search.hbs", model)

    }).catch(function(result) {
        console.log("blaj");
        res.render("books/books_search.hbs", model)
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