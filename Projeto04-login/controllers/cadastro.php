<?php
if($startaction == 1 && $acao == "cadastrar")
{
		$nome=$_POST["nome"];
		$email=$_POST["email"];
		$senha=$_POST["senha"];		
		
		
		if(empty($nome) || empty($email) || empty($senha))
		{
			$msg="Preencha todos os campos!";
		}
		//Todos os campos preenchidos
		else
		{
			//Email válido
			if(filter_var($email,FILTER_VALIDATE_EMAIL))
			{
				//Senha inválida
				if(strlen($senha) < 8)
				{
					$msg="As senhas devem ter no mínimo oito caracteres!";
				}
				//Senha válida
				else
				{
				
						//Executa a classe de cadastro
						$conectar=new Cadastro;
						$conectar=$conectar->cadastrar($nome, $email, $senha);
				
					
				}
			}
			//E-mail inválido
			else
			{
				$msg="Digite seu e-mail corretamente!";
			}
		}
}

?>