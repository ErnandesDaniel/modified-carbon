package ru.scms.back.services;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ru.scms.back.dto.CreateOrderRequestDto;
import ru.scms.back.dto.OrderDto;
import ru.scms.back.entities.Sleeve;
import ru.scms.back.entities.SleeveOrder;
import ru.scms.back.enums.AuditAction;
import ru.scms.back.enums.OrderStatus;
import ru.scms.back.repositories.NeedlecastCaseRepository;
import ru.scms.back.repositories.SleeveOrderRepository;
import ru.scms.back.repositories.SleeveRepository;
import ru.scms.back.repositories.StackRepository;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final SleeveOrderRepository orderRepository;
    private final SleeveRepository sleeveRepository;
    private final StackRepository stackRepository;
    private final NeedlecastCaseRepository caseRepository;
    private final SleeveService sleeveService;
    private final CaseService caseService;
    private final DtoMapper dtoMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<OrderDto> list(OrderStatus status) {
        List<SleeveOrder> orders = status == null
                ? orderRepository.findAllByOrderByCreatedAtDesc()
                : orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return orders.stream().map(dtoMapper::toOrder).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDto> mine(Long methUserId) {
        return orderRepository.findByMethUserIdOrderByCreatedAtDesc(methUserId).stream()
                .map(dtoMapper::toOrder)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderDto get(Long id) {
        return dtoMapper.toOrder(getEntity(id));
    }

    @Transactional
    public OrderDto create(Long methUserId, CreateOrderRequestDto request) {
        Sleeve sleeve = null;
        if (request.sleeveId() != null) {
            sleeve = sleeveRepository
                    .findById(request.sleeveId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sleeve not found"));
        }

        String code = String.format("ORD-%d", 1000 + orderRepository.count() + 1);
        SleeveOrder order = SleeveOrder.builder()
                .code(code)
                .methUserId(methUserId)
                .sleeveId(sleeve == null ? null : sleeve.getId())
                .gender(request.gender() != null ? request.gender() : (sleeve == null ? null : sleeve.getGender()))
                .height(request.height() != null ? request.height() : (sleeve == null ? null : sleeve.getHeight()))
                .weight(request.weight() != null ? request.weight() : (sleeve == null ? null : sleeve.getWeight()))
                .age(request.age() != null ? request.age() : (sleeve == null ? null : sleeve.getAge()))
                .geneticArchiveId(
                        request.geneticArchiveId() != null
                                ? request.geneticArchiveId()
                                : (sleeve == null ? null : sleeve.getGeneticArchiveId()))
                .status(OrderStatus.NEW)
                .build();

        SleeveOrder saved = orderRepository.save(order);
        auditService.log(
                methUserId,
                AuditAction.CREATE,
                "ORDER",
                saved.getId(),
                "Создан заказ " + saved.getCode() + (sleeve == null ? "" : " на тело " + sleeve.getCode()));
        return dtoMapper.toOrder(saved);
    }

    @Transactional
    public OrderDto confirm(Long orderId, Long actorId) {
        SleeveOrder order = getEntity(orderId);
        if (order.getSleeveId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "У заказа нет выбранного тела. Сначала оформите культивирование.");
        }
        sleeveService.reserve(order.getSleeveId(), order.getMethUserId(), actorId);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        boolean hasStack = !stackRepository
                .findByOwnerUserIdOrderByIdAsc(order.getMethUserId())
                .isEmpty();
        if (hasStack && order.getSleeveId() != null) {
            caseService.createFromOrder(order);
        }

        auditService.log(
                actorId,
                AuditAction.ORDER_CONFIRM,
                "ORDER",
                orderId,
                "Заказ " + order.getCode() + " подтверждён, тело зарезервировано");
        return dtoMapper.toOrder(order);
    }

    @Transactional
    public OrderDto awaitBody(Long orderId, Long actorId) {
        SleeveOrder order = getEntity(orderId);
        order.setStatus(OrderStatus.AWAITING_BODY);
        SleeveOrder saved = orderRepository.save(order);
        auditService.log(
                actorId,
                AuditAction.UPDATE,
                "ORDER",
                orderId,
                "Заказ " + order.getCode() + " ожидает тело (культивирование)");
        return dtoMapper.toOrder(saved);
    }

    @Transactional
    public OrderDto cancel(Long orderId, Long actorId) {
        SleeveOrder order = getEntity(orderId);
        order.setStatus(OrderStatus.CANCELLED);
        if (order.getSleeveId() != null) {
            sleeveRepository.findById(order.getSleeveId()).ifPresent(sleeve -> {
                sleeve.setStatus(ru.scms.back.enums.SleeveStatus.AVAILABLE);
                sleeve.setReservedForUserId(null);
                sleeveRepository.save(sleeve);
            });
        }
        SleeveOrder saved = orderRepository.save(order);
        auditService.log(actorId, AuditAction.UPDATE, "ORDER", orderId, "Заказ " + order.getCode() + " отменён");
        return dtoMapper.toOrder(saved);
    }

    @Transactional(readOnly = true)
    public SleeveOrder getEntity(Long id) {
        return orderRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }
}
