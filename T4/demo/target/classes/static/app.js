document.addEventListener("DOMContentLoaded", () => {
    const botonesNota = document.querySelectorAll(".btn-nota");
    botonesNota.forEach(boton => {
        boton.addEventListener("click", (event) => {
            event.preventDefault(); 
            const avisoId = boton.dataset.id;
            const nota = boton.dataset.nota; 

            enviarNota(avisoId, nota);
        });
    });
});

async function enviarNota(avisoId, nota) {
    const url = `/api/notas/aviso/${avisoId}`;

    const respuesta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nota: nota }) 
    });

    if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || "Error en el servidor");
    }

    const data = await respuesta.json();
    const nuevoPromedio = data.nuevoPromedio;

    const celdaNota = document.getElementById(`nota-${avisoId}`);
    if (celdaNota) {
        celdaNota.textContent = nuevoPromedio;
    }

}