package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.CertificateDto;
import ru.scms.back.dto.CheckpointDto;
import ru.scms.back.dto.IncidentRequestDto;
import ru.scms.back.entities.Checkpoint;
import ru.scms.back.entities.Incident;
import ru.scms.back.entities.NeedlecastCase;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.CaseStatus;
import ru.scms.back.enums.CheckpointStatus;
import ru.scms.back.repositories.CheckpointRepository;
import ru.scms.back.repositories.IncidentRepository;
import ru.scms.back.repositories.NeedlecastCaseRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidationService {

    private final CheckpointRepository checkpointRepository;
    private final IncidentRepository incidentRepository;
    private final NeedlecastCaseRepository caseRepository;
    private final CertificateService certificateService;
    private final DtoMapper dtoMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<CheckpointDto> checkpoints(Long caseId) {
        return checkpointRepository.findByCaseIdOrderByIdAsc(caseId).stream()
                .map(dtoMapper::toCheckpoint).toList();
    }

    @Transactional
    public CheckpointDto updateCheckpoint(Long checkpointId, CheckpointStatus status, Long actorId) {
        Checkpoint cp = checkpointRepository.findById(checkpointId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Checkpoint not found"));
        cp.setStatus(status);
        checkpointRepository.save(cp);
        auditService.log(actorId, AuditAction.CHECKPOINT, "CASE", cp.getCaseId(),
                "Чекпоинт «" + cp.getLabel() + "»: " + status);
        return dtoMapper.toCheckpoint(cp);
    }

    @Transactional
    public CertificateDto confirm(Long caseId, Long actorId) {
        NeedlecastCase c = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));

        List<Checkpoint> checkpoints = checkpointRepository.findByCaseIdOrderByIdAsc(caseId);
        boolean hasFailed = checkpoints.stream().anyMatch(cp -> cp.getStatus() == CheckpointStatus.FAILED);
        boolean allPassed = !checkpoints.isEmpty() && checkpoints.stream()
                .filter(cp -> Boolean.TRUE.equals(cp.getRequired()))
                .allMatch(cp -> cp.getStatus() == CheckpointStatus.PASSED);

        if (hasFailed) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Есть непройденные чекпоинты — сертификация невозможна");
        }
        if (!allPassed) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Не все обязательные чекпоинты пройдены");
        }

        c.setStatus(CaseStatus.COMPLETED);
        caseRepository.save(c);

        CertificateDto certificate = certificateService.generate(caseId, actorId);
        auditService.log(actorId, AuditAction.CERTIFY, "CASE", caseId,
                "Клиент " + c.getCode() + " сертифицирован");
        return certificate;
    }

    @Transactional
    public void reportComplication(Long caseId, IncidentRequestDto request, Long actorId) {
        NeedlecastCase c = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));
        c.setStatus(CaseStatus.CORRECTIVE);
        c.setIncidentType(request.type());
        c.setIncidentNote(request.description());
        caseRepository.save(c);

        incidentRepository.save(Incident.builder()
                .caseId(caseId)
                .type(request.type())
                .description(request.description())
                .resolved(false)
                .build());

        auditService.log(actorId, AuditAction.INCIDENT, "CASE", caseId,
                "Осложнение (" + request.type() + ") по кейсу " + c.getCode() + " — выпуск заблокирован");
    }
}
