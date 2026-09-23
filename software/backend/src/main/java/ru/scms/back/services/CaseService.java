package ru.scms.back.services;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.CaseDto;
import ru.scms.back.dto.IncidentDto;
import ru.scms.back.dto.IncidentRequestDto;
import ru.scms.back.entities.Checkpoint;
import ru.scms.back.entities.Incident;
import ru.scms.back.entities.NeedlecastCase;
import ru.scms.back.entities.SleeveOrder;
import ru.scms.back.entities.Stack;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.CaseStatus;
import ru.scms.back.enums.CheckpointCategory;
import ru.scms.back.enums.CheckpointStatus;
import ru.scms.back.enums.SleeveStatus;
import ru.scms.back.repositories.CheckpointRepository;
import ru.scms.back.repositories.IncidentRepository;
import ru.scms.back.repositories.NeedlecastCaseRepository;
import ru.scms.back.repositories.SleeveRepository;
import ru.scms.back.repositories.StackRepository;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final NeedlecastCaseRepository caseRepository;
    private final CheckpointRepository checkpointRepository;
    private final IncidentRepository incidentRepository;
    private final SleeveRepository sleeveRepository;
    private final StackRepository stackRepository;
    private final DtoMapper dtoMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<CaseDto> list(CaseStatus status) {
        List<NeedlecastCase> cases = status == null
                ? caseRepository.findAllByOrderByCreatedAtDesc()
                : caseRepository.findByStatusOrderByCreatedAtAsc(status);
        return cases.stream().map(dtoMapper::toCase).toList();
    }

    @Transactional(readOnly = true)
    public List<CaseDto> byStatuses(Collection<CaseStatus> statuses) {
        return caseRepository.findByStatusInOrderByCreatedAtAsc(statuses).stream()
                .map(dtoMapper::toCase)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CaseDto> mine(Long methUserId) {
        return caseRepository.findByMethUserIdOrderByCreatedAtDesc(methUserId).stream()
                .map(dtoMapper::toCase)
                .toList();
    }

    @Transactional(readOnly = true)
    public CaseDto get(Long id) {
        return dtoMapper.toCase(getEntity(id));
    }

    @Transactional
    public void createFromOrder(SleeveOrder order) {
        if (order.getSleeveId() == null) {
            return;
        }
        Optional<Stack> stack = stackRepository.findByOwnerUserIdOrderByIdAsc(order.getMethUserId()).stream()
                .findFirst();
        if (stack.isEmpty()) {
            return;
        }
        String code = String.format("CS-%d", 100 + caseRepository.count() + 1);
        NeedlecastCase saved = caseRepository.save(NeedlecastCase.builder()
                .code(code)
                .orderId(order.getId())
                .methUserId(order.getMethUserId())
                .sleeveId(order.getSleeveId())
                .stackId(stack.get().getId())
                .status(CaseStatus.PENDING)
                .build());
        ensureCheckpoints(saved.getId());
    }

    @Transactional
    public CaseDto start(Long caseId, String needlecasterName, Long actorId) {
        NeedlecastCase c = getEntity(caseId);
        if (c.getStatus() != CaseStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Процедура уже начата или завершена");
        }
        c.setStatus(CaseStatus.IN_PROGRESS);
        c.setStartTime(LocalDateTime.now());
        if (needlecasterName != null && !needlecasterName.isBlank()) {
            c.setNeedlecasterName(needlecasterName);
        }
        caseRepository.save(c);

        sleeveRepository.findById(c.getSleeveId()).ifPresent(sleeve -> {
            sleeve.setStatus(SleeveStatus.IN_USE);
            sleeveRepository.save(sleeve);
        });
        stackRepository.findById(c.getStackId()).ifPresent(stack -> {
            stack.setStatus(ru.scms.back.enums.StackStatus.IN_USE);
            stack.setLastExtractedAt(LocalDateTime.now());
            stackRepository.save(stack);
        });

        auditService.log(
                actorId, AuditAction.NEEDLECAST_START, "CASE", caseId, "Начат needlecast по кейсу " + c.getCode());
        return dtoMapper.toCase(c);
    }

    @Transactional
    public CaseDto complete(Long caseId, String result, Long actorId) {
        NeedlecastCase c = getEntity(caseId);
        if (c.getStatus() != CaseStatus.IN_PROGRESS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Процедура не находится в процессе");
        }
        c.setStatus(CaseStatus.COMPLETED);
        c.setEndTime(LocalDateTime.now());
        c.setResult(result == null || result.isBlank() ? "SUCCESS" : result);
        caseRepository.save(c);
        ensureCheckpoints(caseId);

        auditService.log(
                actorId,
                AuditAction.NEEDLECAST_COMPLETE,
                "CASE",
                caseId,
                "Процедура " + c.getCode() + " завершена: " + c.getResult());
        return dtoMapper.toCase(c);
    }

    @Transactional
    public CaseDto reportIncident(Long caseId, IncidentRequestDto request, Long actorId) {
        NeedlecastCase c = getEntity(caseId);
        c.setStatus(CaseStatus.INCIDENT);
        c.setEndTime(LocalDateTime.now());
        c.setResult("FAILED");
        c.setIncidentType(request.type());
        c.setIncidentNote(request.description());
        caseRepository.save(c);

        incidentRepository.save(Incident.builder()
                .caseId(caseId)
                .type(request.type())
                .description(request.description())
                .resolved(false)
                .build());

        auditService.log(
                actorId,
                AuditAction.INCIDENT,
                "CASE",
                caseId,
                "Зафиксирован инцидент (" + request.type() + ") по кейсу " + c.getCode());
        return dtoMapper.toCase(c);
    }

    @Transactional(readOnly = true)
    public List<IncidentDto> incidents(Long caseId) {
        return incidentRepository.findByCaseIdOrderByCreatedAtDesc(caseId).stream()
                .map(dtoMapper::toIncident)
                .toList();
    }

    @Transactional
    public void ensureCheckpoints(Long caseId) {
        if (checkpointRepository.countByCaseId(caseId) > 0) {
            return;
        }
        List<Checkpoint> defaults = List.of(
                cp(
                        caseId,
                        "Когнитивный тест #1",
                        "Базовая ориентация: имя, место, дата.",
                        CheckpointCategory.COGNITIVE),
                cp(
                        caseId,
                        "Когнитивный тест #2",
                        "Память: события за последние 48 часов до переноса.",
                        CheckpointCategory.COGNITIVE),
                cp(
                        caseId,
                        "Проверка Stack Shock",
                        "Оценка по шкале Stack Shock Index (0-10).",
                        CheckpointCategory.STACK),
                cp(
                        caseId,
                        "Физический осмотр",
                        "Рефлексы, подвижность конечностей, реакция зрачков.",
                        CheckpointCategory.PHYSICAL),
                cp(
                        caseId,
                        "Идентификация личности",
                        "Подтверждение личности через кодовую фразу и biometric scan.",
                        CheckpointCategory.IDENTITY));
        checkpointRepository.saveAll(defaults);
    }

    private Checkpoint cp(Long caseId, String label, String description, CheckpointCategory category) {
        return Checkpoint.builder()
                .caseId(caseId)
                .label(label)
                .description(description)
                .category(category)
                .status(CheckpointStatus.PENDING)
                .required(true)
                .build();
    }

    @Transactional(readOnly = true)
    public NeedlecastCase getEntity(Long id) {
        return caseRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));
    }
}
