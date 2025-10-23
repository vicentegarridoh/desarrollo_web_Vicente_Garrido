const abrir_index = () => {
    window.location.href = "/" 
}

const abrir_visual = (adoptionId) => {
    window.location.href = "/vista/" + adoptionId;
}

const tableRows = document.querySelectorAll('#adoptionTable tr[data-id]');
tableRows.forEach(row => {
    row.addEventListener('click', function() {
        const adoptionId = this.getAttribute('data-id');
        //invocar funcion
        abrir_visual(adoptionId)
    });
});


const validar_usuario = (usuario) => {
    let lengthValid = usuario.length<= 80;
    let lengthValied2 = usuario.length>= 3;
    return lengthValid && lengthValied2 ;
}
const validar_comentario = (comentario) => {
    let lengthValid = comentario.length>= 5;
    return lengthValid;
}




const validarcomentario = () => {
    console.log("balidadon")
    let myForm1 = document.forms["comentario-form"];
    let usuario = myForm1["usuarioc"].value;
    let comentario = myForm1["comentario0"].value;

    //funciones importantes
    let invalidInputs = [];
    let isValid = true;
    const setInvalidInput = (inputName) => {
        invalidInputs.push(inputName);
        isValid &&= false;
    };

    if (!validar_usuario(usuario)){
        setInvalidInput("usuario");
    }
    if (!validar_comentario(comentario)){
        setInvalidInput("comentario");
    }
    
    if (!isValid) {
        console.log("no valido")
    } else {
        console.log("fasf")
        myForm.submit();
    }   
}

//Botones de apartados
let submitBtnindex = document.getElementById("btn-index")
submitBtnindex.addEventListener("click", abrir_index);


let submitBtncom = document.getElementById("submit-btn-com");
submitBtncom.addEventListener("click",validarcomentario);

