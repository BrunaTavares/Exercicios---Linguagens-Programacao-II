<?php
//Starts
ob_start();
session_start();

//Globais
include("globais.php");

//Include das classes
include("classes/DB.class.php");
include("classes/Cadastro.class.php");
include("classes/Login.class.php");

//Conexão com o banco de dados
$conectar=new DB;
$conectar=$conectar->conectar();

//Controllers
include("controllers/cadastro.php");
?>