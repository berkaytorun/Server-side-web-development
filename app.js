const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const operators = {
    '+': function (a, b) { return a + b },
    '-': function (a, b) { return a - b },
    '/': function (a, b) { return a / b },
    '*': function (a, b) { return a * b }
};


app.use(express.static("public"))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.engine('hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.get('/', function (request, response) {
    response.render("home.hbs")
})
app.get('/about', function (request, response) {
    response.render("about.hbs")
})

app.get('/calculator', function (request, response) {

    response.render("calculator.hbs")
})

app.get('/calculator/answer', function (request, response) {


    const firstnumber = parseInt(request.query.first)
    const secondnumber = parseInt(request.query.second)
    const operation = request.query.operation
    const answer = operators[operation](firstnumber, secondnumber)

    const model = {
        operation: operation,
        firstnumber: firstnumber,
        secondnumber: secondnumber,
        answer: answer
    }
    response.render("view-answer.hbs", model)
})


app.get('/guess', function (request, response) {
    const operations = ['+', '-', '/', '*']
    const firstnumber = Math.floor(Math.random() * 10) + 1
    const secondnumber = Math.floor(Math.random() * 10) + 1

    const operation = operations[Math.floor(Math.random() * 3)]
    const model = {

        operation: operation,
        firstnumber: firstnumber,
        secondnumber: secondnumber,
    }
    response.render("guess.hbs", model)
})

app.post('/guess-answer', function (request, response) {

    const firstnumber = parseInt(request.body.firstnumber)
    const secondnumber = parseInt(request.body.secondnumber)
    const operation = request.body.operation
    const answer = request.body.answer
    const realanswer = operators[operation](firstnumber, secondnumber)
    var str = ""
    if (answer == realanswer) {
        str = "Correct!"
    }
    else {
        str = "Wrong!"
    }

    model = {
        str: str
    }
    response.render('guess-answer.hbs', model)

})
app.listen(8080)