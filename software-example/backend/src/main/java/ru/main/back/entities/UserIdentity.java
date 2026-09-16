package ru.main.back.entities;

import jakarta.persistence.*;
import lombok.*;
import ru.main.back.enums.UserAuthProvider;

@Entity
@Table(name = "user_identities")
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class UserIdentity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String userName;

    @Enumerated(EnumType.STRING)
    private UserAuthProvider providerName;

    private String providerUserId;
}