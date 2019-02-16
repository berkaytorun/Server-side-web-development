
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
        authorityLevel: req.body.authorityLevel,
        Id:req.body.Id
        
    }
    
    bll.create(account)
    .then(function(account) {
        res.render("accounts/account_view.hbs", account)
    }).catch(function(errors) {
        const model = {
            errors: errors
        }
        res.render("error.hbs", model)
    })
})

router.get("/login", function (req, res) {
    res.render("accounts/login.hbs")
})
router.post("/login", function (req, res) {
    const account = {
        userName: req.body.userName,
        password: req.body.password
    }
    bll.login(account)
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


router.get("/edit/:Id", function(req, res) {
    req.query.Id = req.params.Id
    
    bll.getAccountInfo(req)
    .then(function(accountInfo) {
        const model = {
            levels: require("../../dal/models/account_model").levels,
            accountInfo:accountInfo
    }
        res.render("accounts/account_edit.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.post("/edit/:Id", function(req, res) {
    req.query.Id = req.params.Id
    bll.editAccountInfo(req)
    .then(function(accountInfo) {
        bll.getAccountInfo(req)
        .then(function(accountInfo) {
            const model = {
                levels: require("../../dal/models/account_model").levels,
                accountInfo:accountInfo
        }
            res.render("accounts/account_edit.hbs", model)
        }).catch(function(error) {
            res.render("error.hbs", error)
        })
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.get("/:Id", function(req, res) {
    req.query.Id = req.params.Id
    bll.getAccountInfo(req)
    .then(function(accountInfo) {
        res.render("accounts/account_view.hbs", accountInfo)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})


router.post("/delete/:Id", function(req, res) {
    req.query.Id = req.params.Id
    bll.accountDelete(req)
    .then(function() {
        const message = {
            errors: [
                {message: "Account removed"}
            ]
        }
        res.render("error.hbs", message)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})




module.exports = router
