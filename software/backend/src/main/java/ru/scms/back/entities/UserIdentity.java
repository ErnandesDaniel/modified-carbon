package ru.scms.back.entities;

import jakarta.persistence.*;
import lombok.*;
import ru.scms.back.enums.UserAuthProvider;

@Entity
@Table(name = "user_identities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String userName;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_name", nullable = false)
    private UserAuthProvider providerName;

    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;
}
