/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



navigator.geolocation.getCurrentPosition(function (posicao) {
    //console.log(posicao);
    var url = "http://nominatim.openstreetmap.org/reverse?lat="
            + posicao.coords.latitude + "&lon="
            + posicao.coords.longitude
            + "&format=json&json_callback=preencherDados";
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
});
function preencherDados(dados) {
    //alert(dados.address.city);
    //alert(dados.address.state);
    //alert(dados.address.postcode);
    buscarPrevisao(dados.address.city, dados.address.state.charAt(0) + dados.address.state.charAt(4));
}
var xhr;

function buscarPrevisao(cidade, uf) {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = processarPrevisao;
    var url = "http://developers.agenciaideias.com.br/tempo/json/" + cidade + "-" + uf;
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    xhr.open("GET", url);
    //document.getElementById("info").innerHTML = "http://developers.agenciaideias.com.br/tempo/json/" + cidade + "-" + uf;
    xhr.send(null);
}

function processarPrevisao() {
    var info = document.getElementById("info");
    if (xhr.readyState === 4) {
        if (xhr.status === 200) { /* tem resposta */
            var jsonString = xhr.responseText;
            //info.innerHTML = jsonString;
            var resposta = JSON.parse(jsonString);
            montarTela(resposta);
        } else { /* não encontrado */
            //aqui eu escrevo depois do que já existe e está vazio
            info.innerHTML = "Não encontrado!";
        }
    } else {
        //aqui eu escrevo depois do que já existe e está vazio
        //info.innerHTML += "Carregando...";
    }

}

function montarTela(respostaJSON) {
  var i;
      document.getElementById("cidade").innerHTML = respostaJSON.cidade;
      
      for (i = 0; i < 7; i++) {
          document.getElementById(i).style.backgroundColor= "lightblue";
          document.getElementById("dia"+i).innerHTML = respostaJSON.previsoes[i].data;
          document.getElementById("imagem"+i).src = respostaJSON.previsoes[i].imagem;
          document.getElementById("imagem"+i).hidden = false;
          document.getElementById("descricao"+i).innerHTML =  respostaJSON.previsoes[i].descricao;
          document.getElementById("temperatura_max"+i).innerHTML = "Máx " + respostaJSON.previsoes[i].temperatura_max;
          document.getElementById("temperatura_min"+i).innerHTML = "Min " + respostaJSON.previsoes[i].temperatura_min;
    }
}
