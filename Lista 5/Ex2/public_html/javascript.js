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