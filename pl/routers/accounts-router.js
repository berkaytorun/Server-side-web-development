
const express = require('express')
const router = express.Router();

const bll = require("../../bll/accounts-manager")


router.get("/create", function(req, res) {
    if (req.session.accountId === undefined) {
        const model = {errors: [{ message: "You need to be logged in to do that." }]}
        res.render("error.hbs", model)
        return
    }
    const model = {
        levels: require("../../dal/models/account_model").levels
    }
    res.render("accounts/create.hbs", model)
})

router.post("/create", function(req, res) {

    new Promise(function(resolve, reject) {
        if (req.session.accountId === undefined) {
            throw [{ message: "You need to be logged in to do that." }]
        }
        resolve()
    }).then(function() {
        const account = {
            userName: req.body.userName,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            authorityLevel: req.body.authorityLevel
        }

        return bll.create(req.session, account)

    }).then(function(account) {
        const model = {
            account: account
        }
        res.render("accounts/account_view.hbs", model)
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
    bll.login(account, req.session)
    .then(function(account) {
        model = {
            account: account
        }
        res.render("accounts/account_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors
        }
        res.render("error.hbs", model)
    })
})

router.get("/getall", function(req, res) {
    
    bll.findAll(options)
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
    const query = {
        Id: req.params.Id
    }
    
    bll.findOne(req.session, query)
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

    const account = {
        Id: req.params.Id,
        userName:   req.body.userName,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        birthYear:  req.body.birthYear,
        authorityLevel:req.body.authorityLevel,
    }

    bll.update(req.session, account)
    .then(function(accountInfo) {
        bll.findOne(req)
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
    bll.findOne(req)
    .then(function(accountInfo) {
        res.render("accounts/account_view.hbs", accountInfo)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})


router.post("/delete/:Id", function(req, res) {
    const account = { Id = req.params.Id }
    bll.delete(req.session, account)
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
