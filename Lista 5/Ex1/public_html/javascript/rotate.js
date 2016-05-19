function rotateText(id, dt) {
    var setinterval = setInterval(function () {
        rotate(id);
    }, dt);
}
function rotate(id) {
    var texto = document.getElementById(id).innerHTML;
    texto = texto[texto.length - 1] + texto.substring(0, texto.length - 1);
    document.getElementById(id).innerHTML = texto;
}
         