package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.scms.back.enums.CaseStatus;
import ru.scms.back.enums.IncidentType;

import java.time.LocalDateTime;

@Entity
@Table(name = "needlecast_cases")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NeedlecastCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "meth_user_id", nullable = false)
    private Long methUserId;

    @Column(name = "sleeve_id", nullable = false)
    private Long sleeveId;

    @Column(name = "stack_id", nullable = false)
    private Long stackId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status = CaseStatus.PENDING;

    @Column(name = "needlecaster_name")
    private String needlecasterName;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    private String result;

    @Enumerated(EnumType.STRING)
    @Column(name = "incident_type")
    private IncidentType incidentType;

    @Column(name = "incident_note", columnDefinition = "TEXT")
    private String incidentNote;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
