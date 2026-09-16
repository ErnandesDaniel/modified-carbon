package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "genetic_archives")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneticArchive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;
}
