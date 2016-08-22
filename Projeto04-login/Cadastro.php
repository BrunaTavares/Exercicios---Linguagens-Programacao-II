<?php
$page="Cadastro";
include("header.php");
?>
<head>
    <link rel="stylesheet" type="text/css" href="css/estilos.css">
</head>
<body class="align">
  <div class="site__container">

    <div class="grid__container">

      <form action="cadastro.php?acao=cadastrar" method="post" class="form form--login">
         
          <div class="form__field">
          <label class="fontawesome-user" for="login__username"><span class="hidden">Nome</span></label>
          <input id="login__username" type="text" class="form__input" name="nome" required placeholder = 'nome'>
        </div>
          
          <div class="form__field">
          <label class="fontawesome-envelope" for="login__email"><span class="hidden">Email</span></label>
          <input id="login__envelope" type="text" class="form__input" name="email" required placeholder="Email">
        </div>
               
        <div class="form__field">
          <label class="fontawesome-lock" for="login__password"><span class="hidden">Password</span></label>
          <input id="login__password" type="password" class="form__input" name="senha" required placeholder = 'Senha'>
        </div>

        <div class="form__field">
          <input type="submit" value="Sign In"> 
        </div>

      </form>

      <p class="text--center"><a href="index.php">Voltar para Login</a> <span class="fontawesome-arrow-right"></span></p>

    </div>

  </div>

</body>
