package ru.scms.back.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.CultivationRequestDto;
import ru.scms.back.dto.GeneticArchiveDto;
import ru.scms.back.dto.SleeveDto;
import ru.scms.back.entities.GeneticArchive;
import ru.scms.back.entities.Sleeve;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.SleeveGender;
import ru.scms.back.enums.SleeveStatus;
import ru.scms.back.repositories.GeneticArchiveRepository;
import ru.scms.back.repositories.SleeveRepository;

@Service
@RequiredArgsConstructor
public class SleeveService {

    private final SleeveRepository sleeveRepository;
    private final GeneticArchiveRepository geneticArchiveRepository;
    private final DtoMapper dtoMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<SleeveDto> search(
            SleeveStatus status,
            SleeveGender gender,
            Integer heightMin,
            Integer heightMax,
            Integer weightMin,
            Integer weightMax,
            Integer ageMin,
            Integer ageMax,
            String search,
            Boolean availableOnly) {
        List<Specification<Sleeve>> specs = new ArrayList<>();
        if (availableOnly != null && availableOnly) {
            specs.add((root, query, cb) -> cb.equal(root.get("status"), SleeveStatus.AVAILABLE));
        } else if (status != null) {
            specs.add((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (gender != null) {
            specs.add((root, query, cb) -> cb.equal(root.get("gender"), gender));
        }
        if (heightMin != null) {
            specs.add((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("height"), heightMin));
        }
        if (heightMax != null) {
            specs.add((root, query, cb) -> cb.lessThanOrEqualTo(root.get("height"), heightMax));
        }
        if (weightMin != null) {
            specs.add((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("weight"), weightMin));
        }
        if (weightMax != null) {
            specs.add((root, query, cb) -> cb.lessThanOrEqualTo(root.get("weight"), weightMax));
        }
        if (ageMin != null) {
            specs.add((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("age"), ageMin));
        }
        if (ageMax != null) {
            specs.add((root, query, cb) -> cb.lessThanOrEqualTo(root.get("age"), ageMax));
        }
        if (search != null && !search.isBlank()) {
            String like = "%" + search.toLowerCase() + "%";
            specs.add((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("code")), like),
                    cb.like(cb.lower(root.get("notes")), like),
                    cb.like(cb.lower(root.get("dnaDonor")), like)));
        }

        Specification<Sleeve> combined =
                specs.stream().reduce((a, b) -> a.and(b)).orElse((root, query, cb) -> cb.conjunction());

        return sleeveRepository.findAll(combined).stream()
                .sorted((a, b) -> a.getId().compareTo(b.getId()))
                .map(dtoMapper::toSleeve)
                .toList();
    }

    @Transactional(readOnly = true)
    public SleeveDto get(Long id) {
        return dtoMapper.toSleeve(getEntity(id));
    }

    @Transactional(readOnly = true)
    public List<GeneticArchiveDto> listArchives() {
        return geneticArchiveRepository.findAll().stream()
                .map(dtoMapper::toArchive)
                .toList();
    }

    @Transactional
    public SleeveDto orderCultivation(CultivationRequestDto request, Long actorId) {
        GeneticArchive archive = request.geneticArchiveId() == null
                ? null
                : geneticArchiveRepository
                        .findById(request.geneticArchiveId())
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Genetic archive not found"));

        String code = String.format("SLV-%03d", 100 + sleeveRepository.count() + 1);
        Sleeve sleeve = Sleeve.builder()
                .code(code)
                .gender(request.gender() == null ? SleeveGender.MALE : request.gender())
                .height(request.height() == null ? 175 : request.height())
                .weight(request.weight() == null ? 70 : request.weight())
                .age(request.age() == null ? 28 : request.age())
                .geneticArchiveId(request.geneticArchiveId())
                .status(SleeveStatus.CULTIVATING)
                .dnaDonor(archive == null ? "Unknown donor" : archive.getCode() + "-DONOR")
                .notes(request.notes())
                .cultivationStartedAt(LocalDateTime.now())
                .plannedReadyAt(LocalDate.now().plusWeeks(3))
                .cultivationStagePercent(0)
                .build();

        Sleeve saved = sleeveRepository.save(sleeve);
        auditService.log(
                actorId,
                AuditAction.CULTIVATION_ORDER,
                "SLEEVE",
                saved.getId(),
                "Заказано культивирование тела " + saved.getCode());
        return dtoMapper.toSleeve(saved);
    }

    @Transactional
    public SleeveDto acceptIntake(Long id, Long actorId) {
        Sleeve sleeve = getEntity(id);
        sleeve.setStatus(SleeveStatus.AVAILABLE);
        sleeve.setCultivationStagePercent(100);
        Sleeve saved = sleeveRepository.save(sleeve);
        auditService.log(
                actorId, AuditAction.INTAKE_ACCEPT, "SLEEVE", id, "Тело " + sleeve.getCode() + " принято в резерв");
        return dtoMapper.toSleeve(saved);
    }

    @Transactional
    public SleeveDto rejectIntake(Long id, Long actorId) {
        Sleeve sleeve = getEntity(id);
        sleeve.setStatus(SleeveStatus.WRITTEN_OFF);
        String note = "Отклонено при приёмке";
        sleeve.setNotes(sleeve.getNotes() == null ? note : sleeve.getNotes() + ". " + note);
        Sleeve saved = sleeveRepository.save(sleeve);
        auditService.log(
                actorId,
                AuditAction.INTAKE_REJECT,
                "SLEEVE",
                id,
                "Тело " + sleeve.getCode() + " отклонено при приёмке");
        return dtoMapper.toSleeve(saved);
    }

    @Transactional
    public SleeveDto reserve(Long id, Long userId, Long actorId) {
        Sleeve sleeve = getEntity(id);
        if (sleeve.getStatus() != SleeveStatus.AVAILABLE && sleeve.getStatus() != SleeveStatus.RESERVED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Тело " + sleeve.getCode() + " недоступно для резервирования (статус " + sleeve.getStatus() + ")");
        }
        sleeve.setStatus(SleeveStatus.RESERVED);
        sleeve.setReservedForUserId(userId);
        Sleeve saved = sleeveRepository.save(sleeve);
        auditService.log(
                actorId,
                AuditAction.RESERVE,
                "SLEEVE",
                id,
                "Тело " + sleeve.getCode() + " зарезервировано за пользователем " + userId);
        return dtoMapper.toSleeve(saved);
    }

    @Transactional
    public SleeveDto release(Long id, Long actorId) {
        Sleeve sleeve = getEntity(id);
        sleeve.setStatus(SleeveStatus.AVAILABLE);
        sleeve.setReservedForUserId(null);
        Sleeve saved = sleeveRepository.save(sleeve);
        auditService.log(actorId, AuditAction.UPDATE, "SLEEVE", id, "Резерв тела " + sleeve.getCode() + " снят");
        return dtoMapper.toSleeve(saved);
    }

    @Transactional
    public Sleeve getEntity(Long id) {
        return sleeveRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sleeve not found"));
    }
}
