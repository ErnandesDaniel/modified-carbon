package ru.scms.back.dto;

import java.util.List;

public record ClientDashboardDto(
        UserDto user,
        String currentStage,
        List<OrderDto> orders,
        List<CaseDto> cases,
        List<CertificateDto> certificates,
        List<StackDto> stacks) {}
