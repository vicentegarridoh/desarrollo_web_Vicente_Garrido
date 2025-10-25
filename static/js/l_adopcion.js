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
    
    let validarmensaje = document.getElementById("val-msg2");
    let validarBox = document.getElementById("val-box2");

    if (!isValid) {
        console.log("no valido");
        validarmensaje.innerText = "Los datos ingresados no son validos";
        validarBox.hidden = false;
    } else {
        validarBox.hidden = true; 

        const avisoId = myForm1.dataset.avisoId;
        const url = `/api/agregar_comentario/${avisoId}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: usuario,
                comentario: comentario
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                myForm1.reset(); 
                const comentario1 = document.createElement('div');
                comentario1.className = 'comentarios_slot';
                comentario1.innerHTML = `
                    <p class="comentarios_usuario">${data.comentario.usuario}</p>
                    <p class="comentarios_texto">${data.comentario.texto}</p>
                `;
                document.getElementById('comentarios-lista').appendChild(comentario1);
            } 
        })
        .catch(error => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
            validarBox.hidden = false;
        });
    }   
}



















document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("imgModal");
    var span = document.getElementsByClassName("close-button")[0];
    var images = document.getElementsByClassName("gallery-thumbnail");
    for (var i = 0; i < images.length; i++) {
        images[i].onclick = function() {
            modal.style.display = "block"; 
            modalImg.src = this.src;       
        }
    }
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}); 







//Botones de apartados
let submitBtnindex = document.getElementById("btn-index")
submitBtnindex.addEventListener("click", abrir_index);


let submitBtncom = document.getElementById("submit-btn-com");
submitBtncom.addEventListener("click",validarcomentario);

