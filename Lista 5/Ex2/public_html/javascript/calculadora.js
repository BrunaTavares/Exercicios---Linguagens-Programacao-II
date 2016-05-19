/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function backspace() {
    var value = document.getElementById("display").value;
    document.getElementById("display").value = value.substr(0, value.length - 1);
}
function clean(val)
{
    document.getElementById("display").value = val;
}
function add(val)
{
    document.getElementById("display").value += val;
}
function equal()
{
    try
    {
        clean(eval(document.getElementById("display").value));
    } catch (equal)
    {
        clean('Erro');
    }
}

document.addEventListener("keydown", function (evt) {
    //se apertar o shift tem que esperar para ver qual tecla apertará depois 
    if (evt.shiftKey) {
        switch (evt.keyCode) {
            case 57:
                add("(");
                break;
            case 48:
                add(")");
                break;
            case 187:
                add("+");
                break;
            case 56:
                add("*");
            //Igual
            case 13 :
                equal();
                break;
        }
    }
    //backspace apertado
    if (evt.keyCode === 8) { //Evitar que backspace leve à página anterior
        evt.preventDefault();
        backspace();
    }

    //window.alert("O código da tecla pressionada foi: " + evt.keyCode);
    switch (evt.keyCode) {
        //Número 0
        case 48 :
            add("0");
            break;
        case 96:
            add("0");
            break;
            //Número 1
        case 97 :
            add("1");
            break;
        case 49:
            add("1");
            break;
            //Número 2
        case 98 :
            add("2");
            break;
        case 50:
            add("2");
            break;
            //Número 3
        case 99 :
            add("3");
            break;
        case 51:
            add("3");
            break;
            //Número 4
        case 100 :
            add("4");
            break;
        case 52:
            add("4");
            break;
            //Número 5
        case 101 :
            add("5");
            break;
        case 53:
            add("5");
            break;
            //Número 6
        case 102 :
            add("6");
            break;
        case 54:
            add("6");
            break;
            //Número 7
        case 103 :
            add("7");
            break;
        case 55:
            add("7");
            break;
            //Número 8
        case 104 :
            add("8");
            break;
        case 56:
            add("8");
            break;
            //Número 9
        case 105 :
            add("9");
            break;
        case 57:
            add("9");
            break;
            //Sinais e simbolos sem shift
            //Ponto .
        case 194 :
            add("-");
            break;
        case 190:
            add("-");
            break;
            // Menos -
        case 109 :
            add("-");
            break;
        case 189:
            add("-");
            break;
            // Mais +
        case 107 :
            add("+");
            break;
        case 187:
            add("+");
            break;
            // Barra /
        case 111 :
            add("/");
            break;
        case 193:
            add("/");
            break;
            // Asterisco *
        case 106 :
            add("*");
            break;
            //Enter
        case 13 :
            equal();
            break;
    }
}, false);
