
const express = require('express')
const router = express.Router();

const bll = require("../../bll/accounts-manager")


router.get("/create", function(req, res) {
    const model = {
        levels: require("../../dal/models/account_model").levels
    }
    res.render("accounts/create.hbs", model)
})

router.post("/create", function(req, res) {
    const account = {
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        authorityLevel: req.body.authorityLevel
    }
    
    bll.create(account)
    .then(function(author) {
        res.render("books/book_view.hbs", author)
    }).catch(function(errors) {
        const model = {
            errors: errors
        }
        res.render("error.hbs", model)
    })
})
router.get("/getall", function(req, res) {
    const account = {}
    const options = {}
    
    bll.searchFor(account, options)
    .then(function(accounts) {
        model = {
            accounts: accounts
        }
        res.render("accounts/accounts_list.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors
        }
        res.render("error.hbs", model)
    })
})



module.exports = router
