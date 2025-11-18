package web1.controlador;

import web1.servicio.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AvisoController {

    @Autowired
    private AvisoService avisoService;

    @GetMapping("/")
    public String listarAvisos(Model model) {
        model.addAttribute("avisos", avisoService.obtenerTodosLosAvisos());
        return "index";
    }
}
