package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ru.scms.back.enums.StackStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "stacks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "owner_user_id")
    private Long ownerUserId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StackStatus status = StackStatus.STORED;

    private String location;

    @Column(name = "last_extracted_at")
    private LocalDateTime lastExtractedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
