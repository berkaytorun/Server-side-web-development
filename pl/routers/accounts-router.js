
const express = require('express')
const router = express.Router();

const bll = require("../../bll/accounts-manager")


router.get("/create", function(req, res) {
    const model = {
        levels: require("../../dal/models/account_model").levels,
        session: req.session
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

    bll.create(req.session, account)
    .then(function(account) {
        const model = {
            account: account,
            session: req.session
        }
        res.render("accounts/account_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.get("/login", function (req, res) {
    const model = {
        session: req.session
    }
    res.render("accounts/login.hbs", model)
})

router.post("/login", function (req, res) {
    const account = {
        userName: req.body.userName,
        password: req.body.password
    }
    bll.login(req.session, account)
    .then(function(account) {
        model = {
            account: account,
            session: req.session,

        }
        res.render("accounts/account_view.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.get("/logout", function(req, res) {
    bll.logout(req.session)
    .then(function() {
        res.render("home.hbs")
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.get("/getall", function(req, res) {
    
    bll.findAll(req.session)
    .then(function(accounts) {
        model = {
            accounts: accounts,
            session: req.session
        }
        res.render("accounts/accounts_list.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors,
            session: req.session
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
                accountInfo:accountInfo,
                session: req.session
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
    const account = {
        Id: req.params.Id
    } 
    bll.findOne(req.session, account)
    .then(function(accountInfo) {
        const model = {
            account: accountInfo,
            session: req.session
        }
        res.render("accounts/account_view.hbs", model)
    }).catch(function(error) {
        res.render("error.hbs", error)
    })
})

router.post("/delete/:Id", function(req, res) {
    const account = { Id: req.params.Id }
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
