package web1;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "region")

public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @OneToMany(mappedBy = "region")
    private List<Comuna> comunas;
}