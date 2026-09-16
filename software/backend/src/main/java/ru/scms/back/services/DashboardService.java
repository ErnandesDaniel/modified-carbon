package ru.scms.back.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.scms.back.dto.AdminDashboardDto;
import ru.scms.back.dto.ClientDashboardDto;
import ru.scms.back.dto.OrderDto;
import ru.scms.back.dto.UserDto;
import ru.scms.back.entities.NeedlecastCase;
import ru.scms.back.entities.SleeveOrder;
import ru.scms.back.enums.CaseStatus;
import ru.scms.back.enums.OrderStatus;
import ru.scms.back.enums.SleeveStatus;
import ru.scms.back.repositories.CertificateRepository;
import ru.scms.back.repositories.IncidentRepository;
import ru.scms.back.repositories.NeedlecastCaseRepository;
import ru.scms.back.repositories.SleeveOrderRepository;
import ru.scms.back.repositories.SleeveRepository;
import ru.scms.back.repositories.StackRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SleeveRepository sleeveRepository;
    private final SleeveOrderRepository orderRepository;
    private final NeedlecastCaseRepository caseRepository;
    private final IncidentRepository incidentRepository;
    private final CertificateRepository certificateRepository;
    private final StackRepository stackRepository;
    private final UserService userService;
    private final CaseService caseService;
    private final OrderService orderService;
    private final CertificateService certificateService;
    private final AuditService auditService;
    private final DtoMapper dtoMapper;

    @Transactional(readOnly = true)
    public AdminDashboardDto admin() {
        List<CaseStatus> activeStatuses = List.of(CaseStatus.PENDING, CaseStatus.IN_PROGRESS);
        List<CaseStatus> validationStatuses = List.of(CaseStatus.IN_PROGRESS, CaseStatus.COMPLETED, CaseStatus.CORRECTIVE);
        return new AdminDashboardDto(
                sleeveRepository.count(),
                sleeveRepository.countByStatus(SleeveStatus.AVAILABLE),
                sleeveRepository.countByStatus(SleeveStatus.CULTIVATING),
                sleeveRepository.countByStatus(SleeveStatus.INTAKE),
                sleeveRepository.countByStatus(SleeveStatus.RESERVED),
                sleeveRepository.countByStatus(SleeveStatus.IN_USE),
                caseRepository.countByStatus(CaseStatus.PENDING),
                caseRepository.countByStatus(CaseStatus.IN_PROGRESS),
                caseRepository.countByStatus(CaseStatus.COMPLETED),
                caseRepository.countByStatus(CaseStatus.INCIDENT),
                caseRepository.countByStatusIn(validationStatuses),
                incidentRepository.countByResolvedFalse(),
                orderRepository.countByStatus(OrderStatus.NEW),
                auditService.recent()
        );
    }

    @Transactional(readOnly = true)
    public ClientDashboardDto client(Long methUserId) {
        UserDto user = userService.getUser(methUserId);
        List<SleeveOrder> orders = orderRepository.findByMethUserIdOrderByCreatedAtDesc(methUserId);
        List<NeedlecastCase> cases = caseRepository.findByMethUserIdOrderByCreatedAtDesc(methUserId);

        return new ClientDashboardDto(
                user,
                resolveStage(orders, cases),
                orders.stream().map(dtoMapper::toOrder).toList(),
                cases.stream().map(dtoMapper::toCase).toList(),
                certificateService.byMeth(methUserId),
                stackRepository.findByOwnerUserIdOrderByIdAsc(methUserId).stream().map(dtoMapper::toStack).toList()
        );
    }

    private String resolveStage(List<SleeveOrder> orders, List<NeedlecastCase> cases) {
        if (cases.stream().anyMatch(c -> c.getStatus() == CaseStatus.CORRECTIVE)) return "CORRECTIVE";
        if (cases.stream().anyMatch(c -> c.getStatus() == CaseStatus.INCIDENT)) return "INCIDENT";
        if (cases.stream().anyMatch(c -> c.getStatus() == CaseStatus.IN_PROGRESS)) return "NEEDLECAST";
        if (cases.stream().anyMatch(c -> c.getStatus() == CaseStatus.COMPLETED)) return "COMPLETED";
        if (cases.stream().anyMatch(c -> c.getStatus() == CaseStatus.PENDING)) return "SCHEDULED";
        if (orders.stream().anyMatch(o -> o.getStatus() == OrderStatus.AWAITING_BODY)) return "CULTIVATION";
        if (orders.stream().anyMatch(o -> o.getStatus() == OrderStatus.CONFIRMED)) return "RESERVED";
        if (!orders.isEmpty()) return "ORDER_CREATED";
        return "NO_ORDER";
    }
}
