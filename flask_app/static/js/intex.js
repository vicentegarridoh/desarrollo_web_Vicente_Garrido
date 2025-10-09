const abrir_aviso = () => {
    window.location.href = "/aviso"
}
const abrir_l_adopcion = () => {
    window.location.href = "/l_adopcion/1/0"
}
const abrir_estadisticas = () => {
    window.location.href = "/estadisticas"
}
//Botones de apartados
let submitBtnaviso = document.getElementById("btn-aviso")
submitBtnaviso.addEventListener("click", abrir_aviso);

let submitBtnestadisticas = document.getElementById("btn-estadisticas")
submitBtnestadisticas.addEventListener("click", abrir_estadisticas);

let submitBtnl_adopcion = document.getElementById("btn-l_adopcion")
submitBtnl_adopcion.addEventListener("click", abrir_l_adopcion);