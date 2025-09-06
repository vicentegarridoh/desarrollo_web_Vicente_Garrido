const validateSector = (sector) => {
  let lengthValid = sector.length<= 100;
  return lengthValid;
}
const validateNatural = (numero) => {
  if(!numero) return false;
  if(numero % 1 != 0) return false
  return true
}
const validateSelect = (select) => {
  if(!select) return false;
  return true
}
const validateName = (name) => {
  if(!name) return false;
  let lengthValidmin = name.trim().length <= 200;
  let lengthValidmax = name.trim().length >= 3;
  return lengthValidmin && lengthValidmax;
}
const validateEmail = (email) => {
  if (!email) return false;
  let lengthValid = email.length > 15;

  // validamos el formato
  let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let formatValid = re.test(email);

  // devolvemos la lógica AND de las validaciones.
  return lengthValid && formatValid;
}
const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  let lengthValid = phoneNumber.length >= 5+ 8;
  let re1 = /^\s*\+569\./;
  let format2valid = re1.test(phoneNumber);
  return lengthValid  && format2valid;
}
const validateFecha = (fecha) => {
  //de la misma forma en que se autorellena la fecha, se verifica el momento actual
  //y se formatea de la misma manera, y se compara si es mayor
  const ahora = new Date();
  ahora.setHours(ahora.getHours() + 3);
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  
  const fechaActual = `${anio}-${mes}-${dia}T${horas}:${minutos}`;
  if (fechaActual>fecha){
    return false
  }
  return true
}
function validateFiles() {
    //comprueba archivos no vacios
    const archivos = document.querySelectorAll('.file-input');
    let numeroarchivo = false;
    let contador = 0;
    
    for (const input of archivos) {
        if (input.files.length > 0) {
            numeroarchivo = true;
            contador++;
        }
    }
    return numeroarchivo;
}
function validarContactos() {
    const contactos = document.querySelectorAll('#contact-container .contact-input');
    
    //en caso no contacto, retorna true
    if (contactos.length === 0) {
        return true;
    }
    
    // verifica que cumplan con el largo pedido
    for (const contacto of contactos) {
        const valor = contacto.value.trim();
        const longitud = valor.length;
        if (longitud === 0 || longitud < 4 || longitud > 50) {
            return false;
        }
    }
    
    // se cumple
    return true;
}
const validateForm = () => {
  // obtenemos el formulario
  let myForm = document.forms["login-form"];
  //donde
  let region = myForm["select-region"].value;
  let comuna = myForm["select-comuna"].value;
  let sector = myForm["sector"].value;
  //contacto
  let name = myForm["nombre_c"].value;
  let email = myForm["email"].value;
  let numero = myForm["numero_celular"].value;
  
  //aviso
  let tipo = myForm["tipo_m"].value;
  let cantidad = myForm["cantidad_m"].value;
  let edad = myForm["edad_m"].value;
  let un_edad = myForm["un_edad"].value;
  let fecha = myForm["fecha_entrega"].value;

  //funciones importantes
  let invalidInputs = [];
  let isValid = true;
  const setInvalidInput = (inputName) => {
    invalidInputs.push(inputName);
    isValid &&= false;
  };
  
  
  // lógica de validación
  if (!validateSelect(region)) {
    setInvalidInput("region");
  }
  if (!validateSelect(comuna)) {
    setInvalidInput("comuna");
  }
  if (!validateSector(sector)) {
    setInvalidInput("sector");
  }
  if (!validateName(name)) {
    setInvalidInput("Nombre");
  }
  if (!validateEmail(email)) {
    setInvalidInput("Email");
  }
  if (!validatePhoneNumber(numero)) {
    setInvalidInput("Número");
  }
  if (!validateSelect(tipo)) {
    setInvalidInput("tipo");
  }
  if (!validateNatural(cantidad)) {
    setInvalidInput("cantidad");
  } 
  if (!validateNatural(edad)) {
    setInvalidInput("edad");
  } 
  if (!validateSelect(un_edad)) {
    setInvalidInput("un_edad");
  }
  if (!validateFecha(fecha)) {
    setInvalidInput("fecha");
  }
  if (!validateFiles()) {
    setInvalidInput("Fotos");
  }
  if (!validarContactos()) {
    setInvalidInput("redsocial");
  }
  
    // finalmente mostrar la validación
  let validationBox = document.getElementById("val-box");
  let validationMessageElem = document.getElementById("val-msg");
  let validationListElem = document.getElementById("val-list");


  if (!isValid) {
    validationListElem.textContent = "";
    // agregar elementos inválidos al elemento val-list.
    for (input of invalidInputs) {
      let listElement = document.createElement("li");
      listElement.innerText = input;
      validationListElem.append(listElement);
    }
    // establecer val-msg
    validationMessageElem.innerText = "Los siguientes campos son inválidos:";

    // aplicar estilos de error
    validationBox.style.backgroundColor = "#ffdddd";
    validationBox.style.borderLeftColor = "#f44336";

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  } else {
    // Ocultar el formulario
    myForm.style.display = "none";

    // establecer mensaje de éxito
    validationMessageElem.innerText = "¡Formulario válido! ¿Deseas enviarlo o volver?";
    validationListElem.textContent = "";

    // aplicar estilos de éxito
    validationBox.style.backgroundColor = "#ddffdd";
    validationBox.style.borderLeftColor = "#4CAF50";

    // Agregar botones para enviar el formulario o volver
    let submitButton = document.createElement("button");
    submitButton.innerText = "Enviar";
    submitButton.style.marginRight = "10px";
    submitButton.addEventListener("click", () => {
      // myForm.submit();
      // no tenemos un backend al cual enviarle los datos
    validationMessageElem.innerText = "Hemos recibido la información de adopción, muchas gracias y suerte!";

    
    validationListElem.textContent = "";

    //se agrega un boton para poder volver a la pantalla principal una vez mandado el archiv
    let btn_volver = document.createElement("button");
    btn_volver.innerText = "Pantalla Principal";
    btn_volver.addEventListener("click",abrir_index);

    validationListElem.appendChild(btn_volver);
    });


    let backButton = document.createElement("button");
    backButton.innerText = "Volver";
    backButton.addEventListener("click", () => {
      // mostrar el formulario nuevamente
      myForm.style.display = "block";
      validationBox.hidden = true;
    });
    
    validationListElem.appendChild(submitButton);
    validationListElem.appendChild(backButton);

    // hacer visible el mensaje de validación
    validationBox.hidden = false;
  

  }
};

///Botones de apartados
let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click",validateForm);


