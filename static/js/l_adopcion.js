function ExpandirDatos() {
    //funcion para poder expandir los datos seleccionados en la tabla
    const tableView = document.getElementById('tableView');
    const detailView = document.getElementById('detailView');
    const backButton = document.getElementById('backButton');
    const tableRows = document.querySelectorAll('#adoptionTable tr[data-id]');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('expandedImg');
    const captionText = document.getElementById('imageCaption');
    const closeModal = document.getElementsByClassName('close-button')[0];
    
    // se insertan datos de ejemplos
    const adoptionData = {
        9: {
            fechaPublicacion: '2025-08-30 12:00',
            fechaEntrega: '2025-09-05 15:00',
            region: 'Metropolitana',
            comuna: 'Santiago',
            sector: 'Beauchef 850, terraza',
            tipo: 'gato',
            cantidad: '2',
            edad: '2 meses',
            contacto: 'María González',
            telefono: '+56 9 1234 5678',
            email: 'maria.gonzalez@gmail.com',
            descripcion: 'Hermoso gatito rescatado de la calle. Es juguetón, cariñoso y está buscando un hogar permanente donde lo cuiden y lo amen.',
            fotos: ["../media/l_adopcion/tabla1_1.png", "../media/l_adopcion/tabla1_1.png"]
        },
    10: {
            fechaPublicacion: '2025-08-23 19:00',
            fechaEntrega: '2025-08-30 12:00',
            region: 'Metropolitana',
            comuna: 'Ñuñoa',
            sector: 'Estadio Nacional',
            tipo: 'perro',
            cantidad: '1',
            edad: '6 meses',
            contacto: 'Juan Pérez',
            telefono: '+56 9 8765 4321',
            email: 'juan.perez@email.com',
            descripcion: 'Cachorro energético y amigable. Ya tiene todas sus vacunas al día y está esterilizado. Ideal para familia con niños.',
            fotos: ["../media/l_adopcion/tabla1_2.png", "../media/l_adopcion/tabla1_2.png"]
        },
        3: {
            fechaPublicacion: '2025-08-20 09:00',
            fechaEntrega: '2025-08-27 10:00',
            region: 'Metropolitana',
            comuna: 'Providencia',
            sector: 'Plaza',
            tipo: 'gato',
            cantidad: '3',
            edad: '3 meses',
            contacto: 'Ana Silva',
            telefono: '+56 9 5555 1234',
            email: 'ana.silva@email.com',
            descripcion: 'Tres gatitos hermanos buscando hogar. Pueden adoptarse juntos o por separado. Todos son juguetones y están sanos.',
            fotos: ["../media/l_adopcion/tabla1_3.png", "../media/l_adopcion/tabla1_3.png"]
        },
        4: {
            fechaPublicacion: '2025-08-18 14:00',
            fechaEntrega: '2025-08-25 16:00',
            region: 'Metropolitana',
            comuna: 'Santiago',
            sector: 'Morande con Compañia',
            tipo: 'perro',
            cantidad: '4',
            edad: '2 meses',
            contacto: 'Carlos López',
            telefono: '+56 9 9999 8888',
            email: 'carlos.lopez@email.com',
            descripcion: 'Camada de 4 cachorros mestizos. Todos están desparasitados y con primeras vacunas. Buscan hogares responsables.',
            fotos: ['../media/l_adopcion/tabla1_4.png', "../media/l_adopcion/tabla1_4.png"]
        },
        5: {
            fechaPublicacion: '2025-08-15 17:00',
            fechaEntrega: '2025-08-22 14:00',
            region: 'Metropolitana',
            comuna: 'Santiago',
            sector: 'Ministro Carvajar con Ministro Carvajal',
            tipo: 'perro',
            cantidad: '1',
            edad: '1 meses',
            contacto: 'Laura Martínez',
            telefono: '+56 9 7777 3333',
            email: 'laura.martinez@email.com',
            descripcion: 'Pequeño cachorro encontrado abandonado. Necesita cuidados especiales y mucho amor. Es tranquilo y se lleva bien con otros animales.',
            fotos: ["../media/l_adopcion/tabla1_5.png", "../media/l_adopcion/tabla1_5.png"]
        }
    };
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const adoptionId = this.getAttribute('data-id');
            
            showAdoptionDetails(adoptionId);
        });
    });
    
    function showAdoptionDetails(id) {
        const data = adoptionData[id];
    //    link = "/l_adopcion/1/6" 
      //  window.location.href = link
        
        //se rellena la data en los placeholders
        if (data) {
            document.getElementById('detail-fecha-publicacion').textContent = data.fechaPublicacion;
            document.getElementById('detail-fecha-entrega').textContent = data.fechaEntrega;
            document.getElementById('detail-region').textContent = data.region;
            document.getElementById('detail-comuna').textContent = data.comuna;
            document.getElementById('detail-sector').textContent = data.sector;
            document.getElementById('detail-tipo').textContent = data.tipo;
            document.getElementById('detail-cantidad').textContent = data.cantidad; 
            document.getElementById('detail-edad').textContent = data.edad; 
            document.getElementById('detail-contacto').textContent = data.contacto;
            document.getElementById('detail-telefono').textContent = data.telefono;
            document.getElementById('detail-email').textContent = data.email;
            document.getElementById('detail-descripcion').textContent = data.descripcion;
            
            // mostrar fotos
            const fotosContainer = document.getElementById('detail-fotos');
            fotosContainer.innerHTML = '';
            
            data.fotos.forEach((foto, index) => {
                const img = document.createElement('img');
                img.src = foto;
                img.alt = "Foto " + (index + 1) + " de la adopción";
                img.className = 'detail-image';
                
                // agregar evento para ampliar imagen
                img.addEventListener('click', function() {
                    openModal(this);
                });
                
                fotosContainer.appendChild(img);
            });
            
            // cambiar vistas
            tableView.style.display = 'none';
            detailView.style.display = 'block';
            
        }
    }
    
    // evento para el botón de volver
    backButton.addEventListener('click', function() {
        detailView.style.display = 'none';
        tableView.style.display = 'block';
        
    });
    
    function openModal(imgElement) {
        modal.style.display = "block";
        modalImg.src = imgElement.src;
        captionText.innerHTML = imgElement.alt;
    }
    
    closeModal.onclick = function() {
        modal.style.display = "none";
    }
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });
    
}
const abrir_index = () => {
    window.location.href = "/" 
}

document.addEventListener('DOMContentLoaded', ExpandirDatos)
//Botones de apartados
let submitBtnindex = document.getElementById("btn-index")
submitBtnindex.addEventListener("click", abrir_index);

let submitBt9 = document.getElementById("l_9")
submitBtn9.addEventListener("click", abrir_index);
