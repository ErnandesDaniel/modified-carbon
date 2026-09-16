package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ru.scms.back.enums.OrderStatus;
import ru.scms.back.enums.SleeveGender;

import java.time.LocalDateTime;

@Entity
@Table(name = "sleeve_orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SleeveOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "meth_user_id", nullable = false)
    private Long methUserId;

    @Column(name = "sleeve_id")
    private Long sleeveId;

    @Enumerated(EnumType.STRING)
    private SleeveGender gender;

    private Integer height;

    private Integer weight;

    private Integer age;

    @Column(name = "genetic_archive_id")
    private Long geneticArchiveId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.NEW;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
