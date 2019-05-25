run:
	node app.js

install:
	sudo npm init --yes
	sudo npm install express
	sudo npm install express-handlebars
	sudo npm install body-parser
	sudo npm install express-session
	sudo npm install express-mysql-session

	sudo npm install --save mysql2
	sudo npm install --save sequelize
	sudo npm install csurf
	sudo npm install cookie-parser

	sudo npm install bcryptjs
	sudo npm audit fix
	
updateNode:
	sudo npm cache clean -f
	sudo npm install -g n
	sudo n stable
