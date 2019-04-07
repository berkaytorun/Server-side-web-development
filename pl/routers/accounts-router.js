
const express = require('express')
const router = express.Router();
const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

const accountManager = require("../../bll/accounts-manager")

router.get("/create", function(req, res) {
    const model = {
        levels: require("../../dal/models/account_model").levels,
    }
    res.render("accounts/create.hbs", model)
})

router.post("/create", async function(req, res) {

    const account = {
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        authorityId: req.body.authorityId
    }

    try {
        const newAccount = await accountManager.create(req.session.authorityId, account)
        
        const model = {
            account: newAccount,
        }
        res.render("accounts/account_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.get("/login", function (req, res) {
    res.render("accounts/login.hbs")
})

router.post("/login", async function (req, res) {

    const account = {
        userName: req.body.userName,
        password: req.body.password
    }

    try {
        
        const loggedInAccount = await accountManager.login(account)

        req.session.accountId = loggedInAccount.Id
        req.session.authorityId = loggedInAccount.authorityId

        req.session.loggedIn = true
        req.session.userName = loggedInAccount.userName

        const model = {
            account: loggedInAccount,
        }
        res.render("accounts/account_view.hbs", model)
    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)   
    }
})


router.get("/", async function(req, res) {
    
    try {
        const accounts = await accountManager.findAll(req.session.authorityId, req.query)

        if (!accounts) { 
        
            res.render("accounts/accounts_list.hbs")
            return
        }
        const pages = (accounts.count) / req.query.limit
        const pagesArray = generatePageNumbers(pages, req.query.currentPage)

        const model = {
            pages: pagesArray,
            accounts: accounts,
            searchString: req.query.searchString,
            table: req.baseUrl,
            placeholder: "Search for a user name or filter by authority level",
        }
        res.render("accounts/accounts_list.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})


router.get("/edit/:Id", async function(req, res) {

    try {
        const account = await accountManager.findByPk(req.session.authorityId, {Id: req.params.Id})
        const model = {
            levels: require("../../dal/models/account_model").levels,
            accountInfo: account,
        }
        res.render("accounts/account_edit.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/edit/:Id", async function(req, res) {

    const account = {
        Id: req.params.Id,
        userName:   req.body.userName,
        password:   req.body.password,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        authorityId: req.body.authorityId,
    }

    try {
        await accountManager.update(req.session.authorityId, account)
        const updatedAccount = await accountManager.findByPk(req.session.authorityId, account)

        const model = {
            levels: require("../../dal/models/account_model").levels,
            account: updatedAccount,
        }
        res.render("accounts/account_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.get("/:Id", async function(req, res) {
    
    try {
        const account = await accountManager.findByPk(req.session.authorityId, {Id: req.params.Id})

        const model = {
            account: account,
        }
        res.render("accounts/account_view.hbs", model)
    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/delete/:Id",async function(req, res) {

    const requestingAccount = {
        accountId: req.session.accountId,
        authorityId: req.session.authorityId
    }
    const accountToDelete = {
        accountId: req.params.Id
    }

    try {
        await accountManager.delete(requestingAccount, accountToDelete)

        const model = {
            errors: [
                {message: "Account removed"}
            ],
        }
        res.render("status_report.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
        }
        res.render("status_report.hbs", model)
    }
})




module.exports = router
