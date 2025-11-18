package web1.servicio;

import web1.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;

    @Autowired
    private NotaRepository notaRepository;

    @Transactional(readOnly = true)
    public List<AvisoAdopcion> obtenerTodosLosAvisos() {
        return avisoRepository.findAll();
    }

    @Transactional
    public String agregarNota(Integer avisoId, Integer valorNota) {
        if (valorNota < 1 || valorNota > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7.");
        }
        AvisoAdopcion aviso = avisoRepository.findById(avisoId)
                .orElseThrow(() -> new RuntimeException("Aviso no encontrado"));
        Nota nuevaNota = new Nota();
        nuevaNota.setNota(valorNota);
        nuevaNota.setAviso(aviso); 
        notaRepository.save(nuevaNota);
        aviso.getNotas().add(nuevaNota);
        return aviso.getPromedioNotas();
    }
}