run:
	node app.js

install:
	sudo npm init --yes
	sudo npm install express
	sudo npm install express-handlebars
	sudo npm install body-parser
	npm install express-session
	npm install --save cookie-parser

	sudo npm install --save sqlite3
	sudo npm install --save mysql2
	sudo npm install --save sequelize

	sudo npm install bcryptjs
	sudo npm audit fix