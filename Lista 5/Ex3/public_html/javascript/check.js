/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function validar(numero) {

    var numero_cartao = document.getElementById(numero).value;

    var mastercard = /^(?:5[1-5][0-9]{14})$/;
    var visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var american = /^(?:3[47][0-9]{13})$/;
    var digito;

    
    if (numero_cartao.match(mastercard)) {
        if (calculaDigito(numero) === numero_cartao.charAt(15)){
        document.getElementById(numero).style.color = "green";
        document.getElementById('img').src = "img/masterlogo.png";
        document.getElementById('img').hidden = false;
        document.getElementById('label_numero').innerHTML = numero_cartao.substring(0, 4) + " " + numero_cartao.substring(4, 8) + " " + numero_cartao.substring(8, 12) + " " + numero_cartao.substring(12, 16);
        document.getElementById('primeiros_digitos').innerHTML = numero_cartao.substring(0, 4);
       }
    } else {
        if (numero_cartao.match(visa)) {
            if (calculaDigito(numero) === numero_cartao.charAt(15)){
            document.getElementById(numero).style.color = "green";
            document.getElementById('img').hidden = false;
            document.getElementById('img').src = "img/visa-1024x437.jpg";
            document.getElementById('label_numero').innerHTML = numero_cartao.substring(0, 4) + " " + numero_cartao.substring(4, 8) + " " + numero_cartao.substring(8, 12) + " " + numero_cartao.substring(12, 16);
            document.getElementById('primeiros_digitos').innerHTML = numero_cartao.substring(0, 4);
        }
        } else {
            if (numero_cartao.match(american)) {
                if (calculaDigito(numero) === numero_cartao.charAt(15)){
                document.getElementById(numero).style.color = "green";
                document.getElementById('img').hidden = false;
                document.getElementById('img').src = "img/American-Express-icon.png";
                document.getElementById('label_numero').innerHTML = numero_cartao.substring(0, 4) + " " + numero_cartao.substring(4, 8) + " " + numero_cartao.substring(8, 12) + " " + numero_cartao.substring(12, 16);
                document.getElementById('primeiros_digitos').innerHTML = numero_cartao.substring(0, 4);
            }
            } else {
               
                document.getElementById(numero).style.color = "red";
                document.getElementById('img').hidden = true;
                document.getElementById('img').src = "";
                document.getElementById('label_numero').innerHTML = numero_cartao.substring(0, 4) + " " + numero_cartao.substring(4, 8) + " " + numero_cartao.substring(8, 12) + " " + numero_cartao.substring(12, 16);
                document.getElementById('primeiros_digitos').innerHTML = numero_cartao.substring(0, 4);
            
                return false;
            }
        }

    }
}

function calculaDigito(numero) {
    var numero_cartao = document.getElementById(numero).value;
    var digito;
    var teste;
    var aux = 0;

    if (numero_cartao.length === 16) {
        //alert(aux);
        for (i = 1; i <= numero_cartao.length - 1; i++) {
            //Se for par só soma
            if (i % 2 === 0) {
                aux = aux + parseInt(numero_cartao.charAt(i - 1));
            } else {
                //se for impar multiplica por dois e vê se tem 2 digitos
                teste = 2 * parseInt(numero_cartao.charAt(i - 1));
                if (teste.toString().length === 2) {
                    //se tiver 2 dígitos separa e soma
                    aux = aux + parseInt(teste.toString().substring(0, 1)) + parseInt(teste.toString().substring(1, 2));
                } else {
                    aux = aux + 2 * parseInt(numero_cartao.charAt(i - 1));
                }
            }
        }
        digito = ((parseInt((aux/10).toString().substring(0,1))+1)*10)-aux;
        //alert("Dígito= " + digito);
        return digito.toString();
    }
    return 10;
  }
