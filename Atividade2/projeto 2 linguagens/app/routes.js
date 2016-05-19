// app/routes.js
module.exports = function(app, passport) {
	
	var mysql = require('mysql');
	
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'brunaworkbench',
		database : 'social'
	});
	

	// Efetua a conexão com o servidor MySQL
	connection.connect(function(err) {
		if (err) {
			console.error('Erro connectando ao MySQL: ' + err.stack);
			return;
		}		
	});
	
	
	(function() {
		Date.prototype.toMySQLDate = function() {
			var year, month, day, hour, minute, second;
			year = String(this.getFullYear());
			month = String(this.getMonth() + 1);
			if (month.length === 1) {
				month = "0" + month;
			}
			day = String(this.getDate());
			if (day.length === 1) {
				day = "0" + day;
			}
			hour = String(this.getHours());
			if (hour.length === 1) {
				hour = "0" + hour;
			}
			minute = String(this.getMinutes());
			if (minute.length === 1) {
				minute = "0" + minute;
			}
			second = String(this.getSeconds());
			if (second.length === 1) {
				second = "0" + second;
			}		
			return year + "-" + month + "-" + day + " " + 
				   hour + ":" + minute + ":" + second;
		};
	})();	

//---------------------------------------------------------------	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/post', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/post', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	
	//EDITADO --------------------------------------------------------------------------
	
	app.get('/post', isLoggedIn, function(req, res) {
				
		
		var query = connection.query('SELECT * FROM posts ORDER BY published',
				function(error, results) {
					if(error) {
						console.log("ERRO executando a consulta: " + error);
						throw error;
					}
					
					res.render('post.ejs', {
						"data" : results
					});
				});
	});
	
	
	// Em new-entry, abrir a view new-entry
	app.get("/new-entry", isLoggedIn , function(req, res) {
		res.render("new-entry");
	});

	// Quando o form de new-entry for submetido, esta rota
	// será acionada - verificar as condições dos
	// dados submetidos e então tomar alguma ação.
	// Se o título ou o corpo estiverem vazios, responder com
	// código 400 (solicitação imprópria) e enviar a cadeia
	// explicando o problema
	app.post("/new-entry" , isLoggedIn, function(req, res) {
		// Se o campo title ou o campo body do corpo (request.body) do
		// form não tiver valor atribuído, retorne um erro ao cliente
		if (!req.body.title || !req.body.body) {
			res.status(400).send("As entradas devem ter um título");
		} else { 
			
			var query = connection.query('INSERT INTO posts SET ?', 
				{
					title : req.body.title,
					content : req.body.body,
					published : new Date().toMySQLDate(),
					id_user : req.user.id,
					user : req.user.username
				}, 
				// Para exibir erros capturados
				function(error, result) {
					if (error) {
						console.log("ERRO executando inserção: " + error);
						throw error;
					}
					// Para mostrar o texto da query que foi executada
					console.log(query.sql);
					// Retorna o id da linha inserida
					console.log("INSERIU linha com ID:" + result.insertId);
				});
			// Volta para a página inicial
			res.redirect("/post");
		}
	});
	
	
		
	
	//EDITADO FIM --------------------------------------------------------------------------

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	//redireciona para qualquer endereço não mapeado
	app.get('*', function(req, res) {
	    res.redirect('/post');
	});
	
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


