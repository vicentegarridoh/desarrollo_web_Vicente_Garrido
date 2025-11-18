package web1;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "comuna")

public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "region_id", nullable = false) 
    private Region region;

    @OneToMany(mappedBy = "comuna")
    private List<AvisoAdopcion> avisos;
}