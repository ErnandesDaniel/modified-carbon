package ru.scms.back.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.scms.back.entities.SleeveOrder;
import ru.scms.back.enums.OrderStatus;

import java.util.List;

public interface SleeveOrderRepository extends JpaRepository<SleeveOrder, Long> {

    List<SleeveOrder> findAllByOrderByCreatedAtDesc();

    List<SleeveOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<SleeveOrder> findByMethUserIdOrderByCreatedAtDesc(Long methUserId);

    long countByStatus(OrderStatus status);
}
