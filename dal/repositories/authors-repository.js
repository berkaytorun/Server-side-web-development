
const Op = require('sequelize').Op

const Author = require("../models/author_model").Author
const Classification = require("../models/classification_model").Classification


exports.searchAuthors = function(req) {
    return new Promise(function(resolve, reject) {

        let findWhere = {
        
            order: [
                ['firstName', 'ASC']
            ],
            
            limit: req.query.limit,
            offset: req.query.offset,
            where: { } 
        }
        if (req.query.searchString !== "") {
    
            findWhere.where = {
                [Op.or]: [
                    {Id: {
                        [Op.like]: req.query.searchString, 
                        }
                    },
                    {firstName: {
                        [Op.like]: req.query.searchString, 
                        }
                    }
                ]
            }
        }
        Author.findAndCountAll(findWhere)
        .then((authors)=> {
            if (authors.rows.length > 0) {
                let authorslist = [ ]
                for (let i = 0, len = authors.rows.length; i < len; i++) {
                    authorslist.push({
                        Id: authors.rows[i].Id,
                        firstName: authors.rows[i].firstName,
                        lastName: authors.rows[i].lastName,
                        birthYear: authors.rows[i].birthYear,
                    })
                }
                authorslist.total = authors.count
                resolve(authorslist)
            } 
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length = 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}
