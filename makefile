run:
	node app.js

install:
	npm init --yes
	npm install express
	npm install express-handlebars
	npm install body-parser

	npm install --save sqlite3
	npm install --save mysql2
	npm install --save sequelize
