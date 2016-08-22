<?php

	class Login{
		public function logar($email, $senha){
			$buscar=mysql_query("SELECT * FROM usuarios WHERE email='$email' AND senha='$senha' LIMIT 1");
			
			if(mysql_num_rows($buscar) == 1)
			{
				$dados=mysql_fetch_array($buscar);
				if($dados["status"] == 1)
				{
					$_SESSION["email"]=$dados["email"];
					$_SESSION["senha"]=$dados["senha"];
					setcookie("logado",1);
					$log=1;
                                        echo"<div class=\"sucesso\">Você foi logado com sucesso </div>";
				}
				else
				{
					$aviso="Confirme o seu e-mail!";
				}
			}
				if(isset($log))
				{
					echo"<div class=\"sucesso\">Você foi logado com sucesso </div>";
				}
				else
				{
					if(empty($aviso))
					{
					$aviso="Ops! Digite seu e-mail e sua senha corretamente!";
					}
				echo"<div class=\"aviso\">";
				echo $aviso;
				echo"</div>";
				}
		}
	}
?>