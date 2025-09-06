const abrir_aviso = () => {
    window.location.href = "aviso.html"
}
const abrir_l_adopcion = () => {
    window.location.href = "l_adopcion.html"
}
const abrir_estadisticas = () => {
    window.location.href = "estadisticas.html"
}
//Botones de apartados
let submitBtnaviso = document.getElementById("btn-aviso")
submitBtnaviso.addEventListener("click", abrir_aviso);

let submitBtnestadisticas = document.getElementById("btn-estadisticas")
submitBtnestadisticas.addEventListener("click", abrir_estadisticas);

let submitBtnl_adopcion = document.getElementById("btn-l_adopcion")
submitBtnl_adopcion.addEventListener("click", abrir_l_adopcion);