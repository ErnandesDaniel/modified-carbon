package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.scms.back.dto.*;
import ru.scms.back.entities.*;
import ru.scms.back.repositories.*;

@Component
@RequiredArgsConstructor
public class DtoMapper {

    private final UserRepository userRepository;
    private final GeneticArchiveRepository geneticArchiveRepository;
    private final SleeveRepository sleeveRepository;
    private final StackRepository stackRepository;
    private final NeedlecastCaseRepository caseRepository;

    public UserDto toUser(User u) {
        return new UserDto(u.getId(), u.getDisplayName(), u.getEmail(), u.getRole());
    }

    public GeneticArchiveDto toArchive(GeneticArchive a) {
        return new GeneticArchiveDto(a.getId(), a.getCode(), a.getName());
    }

    public SleeveDto toSleeve(Sleeve s) {
        String archiveName = s.getGeneticArchiveId() == null ? null
                : geneticArchiveRepository.findById(s.getGeneticArchiveId()).map(GeneticArchive::getName).orElse(null);
        String reservedName = s.getReservedForUserId() == null ? null
                : userRepository.findById(s.getReservedForUserId()).map(User::getDisplayName).orElse(null);
        return new SleeveDto(s.getId(), s.getCode(), s.getGender(), s.getHeight(), s.getWeight(), s.getAge(),
                s.getGeneticArchiveId(), archiveName, s.getStatus(), s.getDnaDonor(), s.getNotes(),
                s.getCultivationStartedAt(), s.getPlannedReadyAt(), s.getCultivationStagePercent(),
                s.getReservedForUserId(), reservedName, s.getCreatedAt());
    }

    public StackDto toStack(Stack t) {
        String ownerName = t.getOwnerUserId() == null ? null
                : userRepository.findById(t.getOwnerUserId()).map(User::getDisplayName).orElse(null);
        return new StackDto(t.getId(), t.getCode(), t.getOwnerUserId(), ownerName, t.getStatus(),
                t.getLocation(), t.getLastExtractedAt());
    }

    public OrderDto toOrder(SleeveOrder o) {
        String methName = userRepository.findById(o.getMethUserId()).map(User::getDisplayName).orElse(null);
        String sleeveCode = o.getSleeveId() == null ? null
                : sleeveRepository.findById(o.getSleeveId()).map(Sleeve::getCode).orElse(null);
        String archiveName = o.getGeneticArchiveId() == null ? null
                : geneticArchiveRepository.findById(o.getGeneticArchiveId()).map(GeneticArchive::getName).orElse(null);
        return new OrderDto(o.getId(), o.getCode(), o.getMethUserId(), methName, o.getSleeveId(), sleeveCode,
                o.getGender(), o.getHeight(), o.getWeight(), o.getAge(), o.getGeneticArchiveId(), archiveName,
                o.getStatus(), o.getCreatedAt());
    }

    public CaseDto toCase(NeedlecastCase c) {
        String methName = userRepository.findById(c.getMethUserId()).map(User::getDisplayName).orElse(null);
        Sleeve sleeve = c.getSleeveId() == null ? null : sleeveRepository.findById(c.getSleeveId()).orElse(null);
        String stackCode = c.getStackId() == null ? null
                : stackRepository.findById(c.getStackId()).map(Stack::getCode).orElse(null);
        return new CaseDto(c.getId(), c.getCode(), c.getOrderId(), c.getMethUserId(), methName,
                c.getSleeveId(), sleeve == null ? null : sleeve.getCode(),
                sleeve == null ? null : sleeve.getGender(), sleeve == null ? null : sleeve.getHeight(),
                c.getStackId(), stackCode, c.getStatus(), c.getNeedlecasterName(),
                c.getStartTime(), c.getEndTime(), c.getResult(), c.getIncidentType(), c.getIncidentNote(),
                c.getCreatedAt());
    }

    public CheckpointDto toCheckpoint(Checkpoint cp) {
        return new CheckpointDto(cp.getId(), cp.getCaseId(), cp.getLabel(), cp.getDescription(),
                cp.getCategory(), cp.getStatus(), cp.getRequired());
    }

    public IncidentDto toIncident(Incident i) {
        return new IncidentDto(i.getId(), i.getCaseId(), i.getType(), i.getDescription(),
                i.getResolved(), i.getCreatedAt());
    }

    public CertificateDto toCertificate(Certificate c) {
        String methName = userRepository.findById(c.getMethUserId()).map(User::getDisplayName).orElse(null);
        String caseCode = caseRepository.findById(c.getCaseId()).map(NeedlecastCase::getCode).orElse(null);
        return new CertificateDto(c.getId(), c.getCaseId(), caseCode, c.getMethUserId(), methName,
                c.getCode(), c.getStatus(), c.getVerificationCode(), c.getIssuedAt());
    }
}
