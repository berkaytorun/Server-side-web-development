
const express = require('express')
const router = express.Router();

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

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
            errors: errors.errors,
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
            errors: errors.errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.get("/logout", function(req, res) {
    bll.logout(req.session)
    .then(function() {
        res.render("home.hbs")
    }).catch(function(errors) {
        const model = {
            errors: errors.errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})

router.get("/", function(req, res) {
    
    bll.findAll(req.session, req.query)
    .then(function(accounts) {
        const pages = (accounts.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)

        const model = {
            pages: pagesArray,
            accounts: accounts,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a user name or filter by authority level",
            session: req.session
        }
        res.render("accounts/accounts_list.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors.errors,
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
    }).catch(function(errors) {
        const model = {
            errors: errors.errors,
            session: req.session
        }
        res.render("error.hbs", model)
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
    .then(function() {
        const account = {
            Id: req.params.Id,
        }
        return bll.findOne(req.session, account)
    }).then(function(accountInfo) {
        const model = {
            levels: require("../../dal/models/account_model").levels,
            accountInfo:accountInfo,
            session: req.session
        }
        res.render("accounts/account_edit.hbs", model)
    }).catch(function(errors) {
        const model = {
            errors: errors.errors,
            session: req.session
        }
        res.render("error.hbs", model)
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
    }).catch(function(errors) {
        const model = {
            errors: errors.errors,
            session: req.session
        }
        res.render("error.hbs", model)
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
    }).catch(function(errors) {
        const model = {
            errors: errors.errors,
            session: req.session
        }
        res.render("error.hbs", model)
    })
})




module.exports = router
