// Módulos básicos
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');


// MySQL
var mysql = require('mysql');
// ALTERAR AQUI AS CONFIGURAÇÕES DO SEU BD
// Objeto que representa os parâmetros de configuração do BD
var dbconfig = {
	host : 'localhost',
	user : 'root',
	password : 'brunaworkbench',
	database : 'senhas'
};

/* 
 * Modelo de usuário: este exemplo considera que no banco de dados TESTES
 * existe uma tabela denominada USUARIOS com a estrutura a seguir:
 * +--------------+------------------+------+-----+---------+----------------+
 * | Field        | Type             | Null | Key | Default | Extra          |
 * +--------------+------------------+------+-----+---------+----------------+
 * | id           | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
 * | nome_usuario | varchar(20)      | NO   | UNI | NULL    |                |
 * | senha        | char(60)         | NO   |     | NULL    |                |
 * +--------------+------------------+------+-----+---------+----------------+
 * Pode ter outros campos, também, mas dois serão fundamentais ao login: a senhha
 * e um nome único (nome de usuário ou e-mail) que será utilizado para autenticar
 * o usuário.
 
 */

// Cria (mas não conecta) uma conexão com MySQL
var connection = mysql.createConnection(dbconfig);

//Efetua a conexão com o servidor MySQL
connection.connect(function(err) {
	if (err) {
		console.error('Erro connectando ao MySQL: ' + err.stack);
		return;
	}
	console.log('Conexão com MySQL estabelecida com sucesso');
});

// Para o Passport
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');

// A função serializeUser() de Passport determina que dados do usuário devem ser armazenados na sessão.
// O resultado deste método é anexado à sessão como req.session.passport.user = {} 
// NOTA: A função done() é uma função interna do Passport que deve ser invocada para informar ao Passport
// o resultado de uma autenticação. É utiilizada para sinalizar que uma tarefa foi terminada.
// Exemplos de chamadas (o primeiro parâmetro é utilizado para sinalizar exceção, quando ocorrer):
//     done(null, user) : fornece ao Passport o usuário user que foi autenticado;
//     done(null, false) : neste caso, sinaliza ao Passport que houve falha na autenticação;
//     done(null, false, {message: 'Senha incorreta!'}) : variação da função, adicionando um parâmetro com mensagem flash;
//     done(err) : neste caso, quando um erro tiver de ser comunicado, o primeiro parâmetro é diferente de null.
// Done pode ser chamada obtendo ou não seu retorno.
passport.serializeUser(function(user, done) {
    // Retorna o campo id do usuário user
	done(null, user.id);
});

// A função deserializeUser() de Passport retorna todos os dados do usuário a partir de seu id.
// Este id pode ser substituído por qualquer outro atributo único de cada usuário (exemplo: e-mail).
// in deserialize function you provide in first argument of deserialize function that same key of user object 
// Como pode ocorrer um erro na execução da consulta, a função done() aqui utiliza o primeiro parâmetro
// com um possível erro transmitido após a execução da consulta pela função query().
// Caso não haja erro, o resultado da consulta é um vetor contendo apenas um único elemento ->
// por isso que de utilizou rows[0] como objeto de usuário a ser retornado ao Passport.
passport.deserializeUser(function(id, done) {
    connection.query("SELECT * FROM usuarios WHERE id = ? ",[id], function(err, rows){
        done(err, rows[0]);
    });
});

// Middlewares de estratégias
// Estratégia para registrar novo usuário
passport.use(
	'local-signup',	// local-signup é o nome da estratégia (você que inventa)
	new LocalStrategy({ // estratégia local
        usernameField : 'nome_usuario', // NOTA: usernameField e passwordField referenciam nomes dos campos (name)
        passwordField : 'senha',        // do SEU form de LOGIN que serão utilizados na autenticação.
        passReqToCallback : true // Permite passar o objeto req de requisição a função de callback
    },
    function(req, username, password, done) {
        // Determinar dados do usuário a partir de seu nome
        // Verificar se o usuário existe
        connection.query("SELECT * FROM usuarios WHERE nome_usuario = ?",[username], function(err, rows) {
            if (err) { // Se erro na consulta
                return done(err);
            }
            if (rows.length) { // Se há linha retornada - o usuário já existe - não podemos adicioná-lo
            	               // NOTA: signupMessage é um nome qualquer - apenas para referenciar a mensagem 
                return done(null, false, req.flash('signupMessage', 'Este nome de usuário já está em uso.'));
            } else {
                // Senão, o usuário não existe -> crie-o
                var newUserMysql = { // cria uma estrutura para facilitar o INSERT. Notar a senha criptografada
                    username: username,
                    password: bcrypt.hashSync(password, null, null)  // senha criptografada (hash)
                };
                // Comando para inserir o novo usuário
                var insertQuery = "INSERT INTO usuarios ( nome_usuario, senha ) values (?,?)";
                // Executa a inserção
                connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                    newUserMysql.id = rows.insertId;
                    return done(null, newUserMysql);
                });
            }
        });
    })
);

// Estratégia para autenticar um usuário existente
// Explicações similares ao middleware anterior
passport.use(
    'local-login',
    new LocalStrategy({
        usernameField : 'nome_usuario',
        passwordField : 'senha',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        connection.query("SELECT * FROM usuarios WHERE nome_usuario = ?",[username], function(err, rows){
            if (err) {
                return done(err);
            }
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
            }
            // Se existe o usuário, mas a senha não confere
            if (!bcrypt.compareSync(password, rows[0].senha)) {
                return done(null, false, req.flash('loginMessage', 'Senha incorreta!.'));
            }
            // Tudo ok, retorna os dados do usuário
            return done(null, rows[0]);
        });
    })
);

// Criar objeto da aplicação
var app = express();

// Definir o engine de template
app.set('view engine', 'ejs'); // set up ejs for templating

// Logar requisições para o console
app.use(morgan('dev')); // log every request to the console

// Para ler cookies
app.use(cookieParser());

// Para ler dados dos forms
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// Configuração da sessão
// Depois, os dados da sessão poderão ser acessados por meio de req.session
app.use(session({
	secret: '8wy1253bfgte60kmw6511q', // nome secreto do cookie
	resave: true, // força a sessão a ser salva de volta ao armazenamento de sessão mesmo que ela não tenha sido modificada 
	saveUninitialized: true // força uma sessão ser salva mesmo que não tenha sido inicializada
} )); 

app.use(passport.initialize()); //necessário para inicializar o Passport em aplicações Express
app.use(passport.session()); // para usar sessões com logins persistentes
app.use(flash()); // para utilizar mensagens flash armazenadas na sessão


// Rotas da aplicação

// Apresenta a página principal, index.ejs
app.get('/', function(req, res) {
	res.render('index.ejs'); // load the index.ejs file
});

// Apresenta a página de login, login.ejs
app.get('/login', function(req, res) {
	// Aqui, a página será renderizada, passando como parâmetro dados da mensagem
	// flash que foi configurada no Passport. O valor de req.flash('loginMessage')
	// dependerá  do que aconteceu anteriormente em termos de autorização.
	res.render('login.ejs', {
		message : req.flash('loginMessage')
	});
});

// Apresenta o form de login, onde será realizada a autenticação
app.post('/login', passport.authenticate('local-login', { // função de autenticação como callback do login
	successRedirect : '/perfil', // redirecionar para uma página segura após a autenticação
	failureRedirect : '/login', // redirecionar para a página de login, se não foi possível autenticar
	failureFlash : true // utilizar mensagens de flash para sinalizar erro
	}), function(req, res) { // função executada após a autenticação, se ela for bem-sucedida
		if (req.body.lembrar) { // lembrar é uma checkbox do form de login
			req.session.cookie.maxAge = 1000 * 60 * 3; //tempo em milisegundos que o cookie da sessão será mantido (até 3 minutos)
		} else { // senão, mantenha o cookie enquanto estiver com o navegador aberto
			req.session.cookie.expires = false; // neste caso, o cookie dura até a janela ser fechada
		}
		//res.redirect('/'); // Volta para a raiz -> sobrescrito por successRedirect
	});

// Apresenta o form para cadastrar novo usuário
app.get('/criar_conta', function(req, res) {
	// Exibir a página e possíveis mensagens de erro direcionadas à ele
	res.render('criar_conta.ejs', {
		message : req.flash('signupMessage')
	});
});

// Processar os dados submetidos no form de criar_conta
app.post('/criar_conta', passport.authenticate('local-signup', {
	successRedirect : '/perfil', // Se criada com sucesso, já está logado e vai para a página de perfil
	failureRedirect : '/criar_conta', // Senão, vai para a página de criar_conta novamente
	failureFlash : true // aceitar mensagens flash
}));

// Página de perfil - simula uma página que pode ser acessada apenas se o usuário estiver logado
// O método get() suporta múltiplas funções de callback, por exemplo, se isLoggedIn indicar
// que o usuário está autenticado, então a próxima funão de callback, que desenha a página
// de perfil será executada, caso contrário a página inicial será desenhada
app.get('/perfil', isLoggedIn, function(req, res) {
	res.render('perfil.ejs', { // passa os dados autenticados do usuário presentes na sessão
		usuario : req.user //req.user é onde passport armazena os dados do usuário que foi autenticado
	});
});

// Logout
app.get('/logout', function(req, res) {
	req.logout(); // Executa o logout
	res.redirect('/'); // Redireciona para a página inicial
});

// Função auxiliar que indica se o usuário está autenticado ou não
function isLoggedIn(req, res, next) {
	// Se o usuário estiver autenticado, avançar para o próximo middleware
	if (req.isAuthenticated())
		return next();
	// Senão, voltar à pagina inicial
	res.redirect('/');
}

// Execução do servidor
// Definir porta do servidor
var port = process.env.PORT || 3000;
// Servir conexões entrantes...
app.listen(port);
console.log('Servidor executando na porta ' + port);
