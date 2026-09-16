package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import ru.scms.back.enums.CheckpointCategory;
import ru.scms.back.enums.CheckpointStatus;

@Entity
@Table(name = "checkpoints")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Checkpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(nullable = false)
    private String label;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckpointCategory category;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckpointStatus status = CheckpointStatus.PENDING;

    @Builder.Default
    @Column(nullable = false)
    private Boolean required = true;
}
