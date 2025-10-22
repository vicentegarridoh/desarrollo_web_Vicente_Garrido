const updateComunas = () => {
  let regionSelect = document.getElementById("select-region");
  let comunaSelect = document.getElementById("select-comuna");
  let selectedRegion = regionSelect.value;
  
  comunaSelect.innerHTML = '<option value="">Seleccione un comuna</option>';

  region_comuna.regiones.forEach(region => {
    if (region.numero == selectedRegion) {
        region.comunas.forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna.nombre;
            option.text = comuna.nombre;
            comunaSelect.appendChild(option);
        })
       }
 })
  changeArguments();
}
function changeArguments() {
  const comunaSelect = document.getElementById("select-comuna");
  const reasonLabel = document.querySelector("label[for='reason']");
  const reasonTextarea = document.getElementById("comments");
  if (comunaSelect.value !== "") {
      reasonLabel.style.display = "block";
      reasonTextarea.style.display = "block";
  } else {
      reasonLabel.style.display = "none";
      reasonTextarea.style.display = "none";
  }
}
const poblarRegion = () => {
  let regionSelect = document.getElementById("select-region");
  region_comuna.regiones.forEach(region => {
    let option = document.createElement("option");
    option.value = region.numero;
    option.text = region.nombre;
    regionSelect.appendChild(option);
   })    
}
const poblarFecha= () => {
  //en general se toma la fecha actual, se formatea y se inserta en el slot
  //de esta manera estara pre seleccionado la fecha con 3 horas extra
  const ahora = new Date();
  ahora.setHours(ahora.getHours() + 3)
  
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const fechaFormateada = `${anio}-${mes}-${dia}T${horas}:${minutos}`;

  document.getElementById('fecha_entrega').value = fechaFormateada;
}
function poblarRedsocial() {
  const socialSelect = document.getElementById('social-select');
  const contactContainer = document.getElementById('contact-container');
  
  // se almacenan las redes ya seleccionadas
  const addedNetworks = new Set();
  
  socialSelect.addEventListener('change', function() {
      const selectedValue = this.value;
      
      // en caso de que el usuario no seleccione redes, la funcion se mantiene igual
      if (!selectedValue || addedNetworks.has(selectedValue)) {
          this.value = "";
          return;
      }
      
      // se agregan a la listas de redes
      addedNetworks.add(selectedValue);
      
      // crear el cuadro de contacto
      createContactBox(selectedValue);
      this.value = "";
  });
  
  function createContactBox(network) {
      // crear elementos para crear la box
      const contactBox = document.createElement('div');
      contactBox.className = 'contact-box';
      contactBox.dataset.network = network;
      
      const contactHeader = document.createElement('div');
      contactHeader.className = 'contact-header';

      
      const title = document.createElement('h9');
      title.className = 'contact-title';
      title.textContent = getNetworkName(network);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'contact-input';
      input.placeholder = `Ingresa tu ${getNetworkName(network)}`;
      input.required = true;
      input.id = "contact_" + network
      input.name = "contact_" + network
      
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Eliminar';
      
     
      contactHeader.appendChild(title);
      contactBox.appendChild(contactHeader);
      contactBox.appendChild(input);
      contactBox.appendChild(removeBtn);
      
      // agregar al contenedur
      contactContainer.appendChild(contactBox);
      
      // Evento para eliminar el cuadro
      removeBtn.addEventListener('click', function() {
          contactContainer.removeChild(contactBox);
          addedNetworks.delete(network);
      });
  }
  //se crea un diccionario con los nombres
  function getNetworkName(value) {
      const names = {
          'whatsapp': 'WhatsApp',
          'telegram': 'Telegram',
          'x': 'X (Twitter)',
          'instagram': 'Instagram',
          'tiktok': 'TikTok',
          'other': 'Otra red social'
      };
      return names[value] || 'Red Social';
  }
}   
function poblarArchivos() {

    const fileUploaders = document.getElementById('foto_m-input');
    const addMoreButton = document.getElementById('addMoreButton');
    const message = document.getElementById('message');
    
    
    let fileCounter = 0;
    let currentFiles = 0;
    const maxFiles = 5;

    function createFileUploader() {
        fileCounter++;
        currentFiles++;
        
        const container = document.createElement('div');
        container.className = 'file-upload-container';
        container.id = 'file-container-' + fileCounter;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'file-input-' + fileCounter;
        input.name = 'file-input-' + fileCounter;
        input.className = 'file-input';
        input.accept = 'image/*';
        input.className = 'file-input';
     //   input.name = 'fotos_mascota'
       // input.id = 'fotos_mascota'


        const label = document.createElement('label');
        label.htmlFor = 'file-input-' + fileCounter;
        label.className = 'file-button';


        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.id = 'file-name-' + fileCounter;
        

        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
                fileName.classList.add('has-file');
            } else {
                fileName.textContent = 'Ningún archivo seleccionado';
                fileName.classList.remove('has-file');
            }
        });
        
        container.appendChild(input);
        container.appendChild(label);
        container.appendChild(fileName);
        
        fileUploaders.appendChild(container);
        

        updateCounter();
    }

    function updateCounter() {
        
        if (currentFiles >= maxFiles) {
            addMoreButton.disabled = true;
            addMoreButton.textContent = 'Límite alcanzado';
        } else {
            addMoreButton.disabled = false;
            addMoreButton.textContent = 'Añadir otro archivo';
        }
    }
    createFileUploader();
    addMoreButton.addEventListener('click', function() {
        if (currentFiles < maxFiles) {
            createFileUploader();
        }
    });
}
const abrir_index = () => {
    window.location.href = "/" 
}
window.onload = () => {
  poblarRegion();
  changeArguments();
};
//Eventos
document.getElementById("select-region").addEventListener("change", updateComunas);
document.getElementById("select-comuna").addEventListener("change", changeArguments);
document.addEventListener('DOMContentLoaded', poblarFecha);
document.addEventListener('DOMContentLoaded', poblarRedsocial)
document.addEventListener('DOMContentLoaded', poblarArchivos)

//Botones de apartados
let submitBtnindex = document.getElementById("btn-index")
submitBtnindex.addEventListener("click", abrir_index);









   

