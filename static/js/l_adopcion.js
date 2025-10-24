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
        let validarmensaje = document.getElementById("val-msg2");
        let validarBox = document.getElementById("val-box2");
        validarmensaje.innerText = "Los datos ingresados no son validos";
        validarBox.hidden = false;


    } else {
        console.log("valido")
        myForm1.submit();
    }   
}

//Botones de apartados
let submitBtnindex = document.getElementById("btn-index")
submitBtnindex.addEventListener("click", abrir_index);


let submitBtncom = document.getElementById("submit-btn-com");
submitBtncom.addEventListener("click",validarcomentario);

