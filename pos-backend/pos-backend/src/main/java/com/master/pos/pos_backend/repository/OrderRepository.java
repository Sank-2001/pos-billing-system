package com.master.pos.pos_backend.repository;

import com.master.pos.pos_backend.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
}
