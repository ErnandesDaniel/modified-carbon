package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.scms.back.enums.SleeveGender;
import ru.scms.back.enums.SleeveStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sleeves")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sleeve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SleeveGender gender;

    @Column(nullable = false)
    private Integer height;

    @Column(nullable = false)
    private Integer weight;

    @Column(nullable = false)
    private Integer age;

    @Column(name = "genetic_archive_id")
    private Long geneticArchiveId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SleeveStatus status = SleeveStatus.AVAILABLE;

    @Column(name = "dna_donor")
    private String dnaDonor;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cultivation_started_at")
    private LocalDateTime cultivationStartedAt;

    @Column(name = "planned_ready_at")
    private LocalDate plannedReadyAt;

    @Builder.Default
    @Column(name = "cultivation_stage_percent", nullable = false)
    private Integer cultivationStagePercent = 0;

    @Column(name = "reserved_for_user_id")
    private Long reservedForUserId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
