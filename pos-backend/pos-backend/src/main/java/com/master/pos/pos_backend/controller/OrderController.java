package com.master.pos.pos_backend.controller;

import com.master.pos.pos_backend.entity.Customer;
import com.master.pos.pos_backend.entity.OrderEntity;
import com.master.pos.pos_backend.entity.OrderItem;
import com.master.pos.pos_backend.entity.Product;
import com.master.pos.pos_backend.repository.CustomerRepository;
import com.master.pos.pos_backend.repository.OrderItemRepository;
import com.master.pos.pos_backend.repository.OrderRepository;
import com.master.pos.pos_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    // ================================
    // ✔ 1. CREATE ORDER
    // ================================
    @PostMapping("")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> req) {

        Long customerId = Long.parseLong(req.get("customerId").toString());
        Double totalAmount = Double.valueOf(req.get("totalAmount").toString());

        // Fetch customer
        Customer customer = customerRepository.findById(customerId).orElse(null);

        // Create Order
        OrderEntity order = new OrderEntity();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(totalAmount);

        OrderEntity savedOrder = orderRepository.save(order);

        // Saving items
        List<Map<String, Object>> items =
                (List<Map<String, Object>>) req.get("items");

        for (Map<String, Object> item : items) {

            Long productId = Long.parseLong(item.get("productId").toString());
            Double price = Double.valueOf(item.get("price").toString());
            Integer qty = Integer.parseInt(item.get("quantity").toString());

            Product product = productRepository
                    .findById(productId)
                    .orElse(null);

            OrderItem oi = new OrderItem();
            oi.setOrder(savedOrder);
            oi.setProduct(product);
            oi.setPrice(price);
            oi.setQuantity(qty);

            orderItemRepository.save(oi);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("orderId", savedOrder.getId());
        resp.put("message", "Order Created Successfully!");

        return resp;
    }

    // ================================
    // ✔ 2. GET ALL ORDERS FOR LIST PAGE
    // ================================
    @GetMapping("")
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }



    // ================================
    // ✔ 3. GET SINGLE ORDER FOR INVOICE PAGE
    // ================================
    @GetMapping("/{id}")
    public OrderEntity getOrder(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }


}
