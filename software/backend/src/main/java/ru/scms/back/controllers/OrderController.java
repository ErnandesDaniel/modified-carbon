package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.CreateOrderRequestDto;
import ru.scms.back.dto.OrderDto;
import ru.scms.back.enums.OrderStatus;
import ru.scms.back.services.OrderService;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "UC-01: заказы клиента на тело")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Список заказов")
    public List<OrderDto> list(@RequestParam(required = false) OrderStatus status) {
        return orderService.list(status);
    }

    @GetMapping("/mine")
    @Operation(summary = "Мои заказы (для клиента)")
    public List<OrderDto> mine(@CurrentUserId Long userId) {
        return orderService.mine(userId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Заказ по ID")
    public OrderDto get(@PathVariable Long id) {
        return orderService.get(id);
    }

    @PostMapping
    @Operation(summary = "UC-01: создать заказ на тело")
    public OrderDto create(@CurrentUserId Long userId, @RequestBody CreateOrderRequestDto request) {
        return orderService.create(userId, request);
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "UC-01: подтвердить заказ и зарезервировать тело")
    public OrderDto confirm(@CurrentUserId Long actorId, @PathVariable Long id) {
        return orderService.confirm(id, actorId);
    }

    @PostMapping("/{id}/await-body")
    @Operation(summary = "UC-01 (NoAvailableSleeves): перевести заказ в ожидание тела")
    public OrderDto awaitBody(@CurrentUserId Long actorId, @PathVariable Long id) {
        return orderService.awaitBody(id, actorId);
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Отменить заказ")
    public OrderDto cancel(@CurrentUserId Long actorId, @PathVariable Long id) {
        return orderService.cancel(id, actorId);
    }
}
