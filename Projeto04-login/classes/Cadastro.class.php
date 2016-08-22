<?php
	class Cadastro{
		public function cadastrar($nome, $email, $senha){
		
			$validaremail=mysql_query("SELECT * FROM usuarios WHERE email='$email'");
			$contar=mysql_num_rows($validaremail);
			
			if($contar == 0)
			{
				$insert=mysql_query("INSERT INTO usuarios(nome, email, senha, data)VALUES('$nome','$email','$senha', NOW())");
				$aviso="Desculpe, mas já existe um usuario cadastrado com este e-mail em nosso sistema!";
			}
				
			if(isset($insert))
			{
				$aviso="Cadastro realizado com sucesso!";
				echo"<div class=\"sucesso\">";
				echo $aviso;
				echo"</div>";
			}
			else
			{
				if(empty($aviso))
				{
					$aviso="Ops! Houve um erro em nosso sistema!";
				}
				echo"<div class=\"aviso\">";
				echo $aviso;
				echo"</div>";
			}
		}
	
	}