package web1.controlador;

import web1.servicio.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notas") 
public class NotaRestController {

    @Autowired
    private AvisoService avisoService;

    public static class NotaPayload {
        private Integer nota;
        public Integer getNota() { return nota; }
        public void setNota(Integer nota) { this.nota = nota; }
    }

    @PostMapping("/aviso/{avisoId}")
    public ResponseEntity<?> guardarNota(
            @PathVariable Integer avisoId,
            @RequestBody NotaPayload payload) {
        
        String nuevoPromedio = avisoService.agregarNota(avisoId, payload.getNota());
        return ResponseEntity.ok(Map.of("nuevoPromedio", nuevoPromedio));

    }
}