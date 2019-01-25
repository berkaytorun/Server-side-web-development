const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')

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

app.use(bodyParser.urlencoded({
    extended: false
}))
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.get('/', function (request, response) {
    response.render("home.hbs")
})
app.get('/about', function (request, response) {
    response.render("about.hbs")
})

app.get('/login', function (request, response) {

    response.render("login.hbs")
})


app.post('/books', function (request, response) {

    response.render("login.hbs")
})
app.get('/books/:id', function (request, response) {
	const model = {
		posts: posts
	}
    response.render("books/books_search.hbs", model)
})

/*
app.update('/books/:id', function (request, response) {

    response.render("login.hbs")
})
app.delete('/books/:id', function (request, response) {
    
    response.render("login.hbs")
})
*/



app.listen(8080)