package com.master.pos.pos_backend.repository;

import com.master.pos.pos_backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT i FROM OrderItem i WHERE i.order.id = :orderId")
    List<OrderItem> findByOrderId(Long orderId);

}
