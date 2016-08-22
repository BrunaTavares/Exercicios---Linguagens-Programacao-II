<?php
$page="Login";
include("header.php");
?>
<head>
    <link rel="stylesheet" type="text/css" href="css/estilos.css">
</head>
<body class="align">

  <div class="site__container">

    <div class="grid__container">

      <form action='index.php?acao=logar' method='post' class="form form--login">

        <div  class="form__field">
          <label class="fontawesome-user" for="login__username"><span class="hidden">Email</span></label>
          <input id="login__username" type="text" class="form__input" name='email' placeholder = 'E-mail' required>
        </div>

        <div class="form__field">
          <label class="fontawesome-lock" for="login__password"><span class="hidden">Senha</span></label>
          <input id="login__password" type="password" name='senha' class="form__input" placeholder='Senha' required>
        </div>

        <div class="form__field">
          <input type="submit" value="Log In">
        </div>

      </form>

      <p class="text--center">Não tem login? <a href="Cadastro.php">Cadastre-se aqui!</a> <span class="fontawesome-arrow-right"></span></p>

    </div>

  </div>

</body>
