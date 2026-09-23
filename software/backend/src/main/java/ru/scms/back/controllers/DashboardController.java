package ru.scms.back.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.scms.back.annotations.CurrentUserId;
import ru.scms.back.dto.AdminDashboardDto;
import ru.scms.back.dto.ClientDashboardDto;
import ru.scms.back.services.DashboardService;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Дашборды персонала и клиента")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @Operation(summary = "Дашборд клиники (персонал)")
    public AdminDashboardDto admin() {
        return dashboardService.admin();
    }

    @GetMapping("/client")
    @Operation(summary = "Личный кабинет Meth")
    public ClientDashboardDto client(@CurrentUserId Long userId) {
        return dashboardService.client(userId);
    }
}
