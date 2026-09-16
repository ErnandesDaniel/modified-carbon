package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import ru.scms.back.enums.CertificateStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private Long caseId;

    @Column(name = "meth_user_id", nullable = false)
    private Long methUserId;

    @Column(nullable = false, unique = true)
    private String code;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateStatus status = CertificateStatus.READY;

    @Column(name = "verification_code", nullable = false)
    private String verificationCode;

    @CreationTimestamp
    @Column(name = "issued_at", nullable = false, updatable = false)
    private LocalDateTime issuedAt;
}
