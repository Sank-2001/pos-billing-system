package com.master.pos.pos_backend.controller;

import com.master.pos.pos_backend.entity.OrderItem;
import com.master.pos.pos_backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "*")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    // 🔹 Get items of a specific order
    @GetMapping("/{orderId}")
    public List<OrderItem> getItemsByOrder(@PathVariable Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}
