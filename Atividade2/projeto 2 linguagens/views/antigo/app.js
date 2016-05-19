/*
 * * * * Links interessantes * * * *
 * Documentação do Node.js: https://nodejs.org/docs/latest/api/.
 * Documentação do Express: http://expressjs.com/pt-br/api.html.
 * Documentação do EJS: http://www.embeddedjs.com.
 * Documentação de package.json: https://docs.npmjs.com/files/package.json.
 * Documentação sobre versionamento de aplicações: http://semver.org/lang/pt-BR/.
 * Documentação de como usar Express com bancos de dados: http://expressjs.com/pt-br/guide/database-integration.html.
 * Documentação do módulo mysql: https://github.com/felixge/node-mysql/ 
 */

// http: executar o servidor
var http = require("http");
// path: manipulação de caminhos
var path = require("path");
// express: o framework usado na aplicação
var express = require("express");
// morgan: permite logar requisições no console
var logger = require("morgan");
// body-parser: analisa e retorna partes do
// corpo de um documento HTML
var bodyParser = require("body-parser");
// mysql: permite conectar a um servidor MySQL
var mysql = require('mysql');

// Função para converter Date do Javascript em 
// Date do MySQL - ela apenas inverte e corrige
// os elementos da data.
// Uso: crie uma data e execute data.toMySQLDate()
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
// Se quiser testar, descomente a linha a seguir e observe console
// console.log(new Date().toMySQLDate());

/*
 * IMPORTANTE
 * Este exemplo assume que você possui um banco de dados MySQL denominado
 * testes com usuário root, senha root e uma tabela denominada entry com a estrutura
 * descrita a seguir:
 * +-----------+---------------+------+-----+---------+----------------+
 * | Field     | Type          | Null | Key | Default | Extra          |
 * +-----------+---------------+------+-----+---------+----------------+
 * | id        | int(11)       | NO   | PRI | NULL    | auto_increment |
 * | title     | varchar(80)   | NO   |     | NULL    |                |
 * | content   | varchar(1024) | NO   |     | NULL    |                |
 * | published | datetime      | NO   |     | NULL    |                |
 * +-----------+---------------+------+-----+---------+----------------+
 */

// Criar uma conexão com o servidor MySQL
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'testes'
});

// Efetua a conexão com o servidor MySQL
connection.connect(function(err) {
	if (err) {
		console.error('Erro connectando ao MySQL: ' + err.stack);
		return;
	}
	console.log('Conexão com MySQL estabelecida com sucesso');
});

// Função de tratamento de evento para ser executada ao se encerrar
//  o servidor com o intuito de fechar a conexão com o banco de dados
function bye() {
	console.log('Encerrando o servidor...');
	console.log('Fechando a conexão com o MySQL');
	// Fecha a conexão com o banco de dados
	connection.end();
	console.log('Pronto!');
	process.exit();
}

// Pode-se associar um tratador de evento de processo do objeto 
// process (Node.js) de modo a executar algum código quendo tal 
// evento for obtido.
// Exceto pelo evento SIGKILL (que é emitido de algum modo por 
// todos os sistemas operacionais que o Node.js está implementado)
// os outros sinais podem ser tratados.
// NOTA: o "botão vermelho" do Eclipse emite um SIGKILL ao processo
// node que se está terminando, portanto, não se pode capturar tal
// evento.

// Evento de interrupção CTRL+C
process.on('SIGINT', bye);

// Evento de terminação CTRL+C
process.on('SIGTERM', bye);

// Alguma exceção não capturada
process.on('uncaughtException', bye);

// Cria o objeto da aplicação
var app = express();

// Define a pasta views como a pasta para armazenar
// as views do sistema
app.set("views", path.resolve(__dirname, "views"));
// Define como template engine a biblioteca EJS
app.set("view engine", "ejs");

// Utiliza o middleware de log Morgan
app.use(logger("dev"));

// Utiliza o middleware bodyParser para retornar de
// modo simples os dados de um formulário
// o método urlencoded() indica que os dados a serem processados
// deverão ter sido submetidos com o tipo de conteúdo
// application/x-www-form-urlencoded, em que os dados são
// representados por uma única cadeia contendo pares variavel=valor
// separados pelo caractere &
// O valor extended sempre deve ser informado. Seu valor igual à false
// indica que se utilizará uma bilbioteca interna denominada
// querystring para obter os dados do form. Se for true, utilizará
// uma biblioteca mais sofisticada, abrangendo mais formatos, denominada qs.
app.use(bodyParser.urlencoded({
	extended : false
}));

// Roteamentos e visões

// Na raiz do site, abrir a view index
app.get("/", function(request, response) {
	// Executar a consulta das entradas de entry, ordenando
	// pela data de modo crescente
	var query = connection.query('SELECT * FROM entry ORDER BY published',
			function(error, results) {
				if(error) {
					console.log("ERRO executando a consulta: " + error);
					throw error;
				}
				response.render("index", {
					"data" : results
				});
			});
});

// Em new-entry, abrir a view new-entry
app.get("/new-entry", function(request, response) {
	response.render("new-entry");
});

// Quando o form de new-entry for submetido, esta rota
// será acionada - verificar as condições dos
// dados submetidos e então tomar alguma ação.
// Se o título ou o corpo estiverem vazios, responder com
// código 400 (solicitação imprópria) e enviar a cadeia
// explicando o problema
app.post("/new-entry", function(request, response) {
	// Se o campo title ou o campo body do corpo (request.body) do
	// form não tiver valor atribuído, retorne um erro ao cliente
	if (!request.body.title || !request.body.body) {
		response.status(400).send("As entradas devem ter um título");
	} else { // Senão, os dados estão presentes - armazene e volte à página
		// principal
		// Adiciona um objeto com os dados e a data na tabela entry
		// O método query() executa comandos SQL:
		//   - O primeiro parâmetro é o texto da consulta;
		//   - O segundo é uma função de callback que pode ter dois ou três
		//     parâmetros: o erro (se houver), o resultado (se SELECT as linhas
		//     retornadas ou campo específico para INSERT, UPDATE e DELETE e o
		//     terceiro (opcional) com informações a respeito dos campos
		//     retornados.
		var query = connection.query('INSERT INTO entry SET ?', 
			{
				title : request.body.title,
				content : request.body.body,
				published : new Date().toMySQLDate()
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
		response.redirect("/");
	}
});

// Último middleware - qualquer outra rota retorna
// erro 404
app.use(function(request, response) {
	response.status(404).render("404");
});

// Executa o servidor
var server = http.createServer(app).listen(3000, function() {
	console.log("Aplicação Guestbook iniciada na port 3000.");
});
