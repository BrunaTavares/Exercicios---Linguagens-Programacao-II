<?php
	class DB{
		public function conectar(){
                        $servidor = "localhost:3307";;
			$schema = "test";
			$senha = "";
			$usuario = "root";
			
			$conexao=mysql_connect($servidor,$usuario,$senha);
			$selectdb=mysql_select_db($schema);
			
			return $conexao;
		}
	}