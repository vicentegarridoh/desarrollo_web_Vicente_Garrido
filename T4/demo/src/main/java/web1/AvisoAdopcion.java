package web1;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "aviso_adopcion")

@Getter
@Setter

public class AvisoAdopcion {
    public enum TipoAnimal {
        gato,
        perro
    }

    public enum UnidadMedidaEdad {
        a, 
        m  
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;

    @Column(name = "sector", length = 100)
    private String sector;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "celular", length = 15)
    private String celular;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoAnimal tipo;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "edad", nullable = false)
    private Integer edad;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", nullable = false)
    private UnidadMedidaEdad unidadMedida;

    @Column(name = "fecha_entrega", nullable = false)
    private LocalDateTime fechaEntrega;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Transient 
    public String getPromedioNotas() {
        if (this.notas == null || this.notas.isEmpty()) {
            return "-";
        }

        double sum = 0;
        for (Nota nota : this.notas) {
            sum += nota.getNota();
        }
        
        double promedio = sum / this.notas.size();
        return String.format("%.1f", promedio);
    }
    @ManyToOne
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    @OneToMany(mappedBy = "aviso")
    private List<Nota> notas;
}
