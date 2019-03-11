
const express = require('express')
const router = express.Router();

const generatePageNumbers = require("../functionality/functionality").generatePageNumbers

const accountManager = require("../../bll/accounts-manager")

router.get("/create", function(req, res) {
    const model = {
        levels: require("../../dal/models/account_model").levels,
        session: req.session
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
        await accountManager.create(req.session.authorityId, account)
        
        const model = {
            account: account,
            session: req.session
        }
        res.render("accounts/account_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

router.get("/login", function (req, res) {
    const model = {
        session: req.session
    }
    res.render("accounts/login.hbs", model)
})

router.post("/login", async function (req, res) {

    const account = {
        userName: req.body.userName,
        password: req.body.password
    }

    try {
        
        const dbAccount = await accountManager.login(account)

        req.session.accountId = dbAccount.Id
        req.session.authorityId = dbAccount.authorityId

        req.session.loggedIn = true
        req.session.userName = dbAccount.userName

        const model = {
            account: dbAccount,
            session: req.session,
        }
        res.render("accounts/account_view.hbs", model)
    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)   
    }
})


router.get("/", async function(req, res) {
    
    try {
        const accounts = await accountManager.findAll(req.session.authorityId, req.query)

        if (!accounts) { 
            const model = { session: req.session }
            res.render("accounts/accounts_list.hbs", model)
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
            session: req.session
        }
        res.render("accounts/accounts_list.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
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
            session: req.session
        }
        res.render("accounts/account_edit.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
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
            session: req.session
        }
        res.render("accounts/account_view.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

router.get("/:Id", async function(req, res) {
    
    try {
        const account = await accountManager.findByPk(req.session.authorityId, {Id: req.params.Id})

        const model = {
            account: account,
            session: req.session
        }
        res.render("accounts/account_view.hbs", model)
    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})

router.post("/delete/:Id", async function(req, res) {

    try {
        await accountManager.delete(req.session.authorityId, { Id: req.params.Id })

        const model = {
            errors: [
                {message: "Account removed"}
            ],
            session: req.session
        }
        res.render("status_report.hbs", model)

    } catch (errors) {
        const model = {
            errors: errors,
            session: req.session
        }
        res.render("status_report.hbs", model)
    }
})




module.exports = router
