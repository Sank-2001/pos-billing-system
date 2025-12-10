package com.master.pos.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class OrderEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // customer relation
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // store order date/time
    @Column(name = "order_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime orderDate;

    @Column(name = "total_amount")
    private Double totalAmount;

    // order items relation
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    // optional: manage JSON side to avoid circular serialization
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();

    // constructors
    public OrderEntity() {}

    // getters / setters
    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    // used by controllers: setCustomer(Customer)
    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    // used by controllers: setOrderDate(LocalDateTime)
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    // helper to add item and maintain both sides
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    @Override
    public String toString() {
        return "OrderEntity{" + "id=" + id + ", totalAmount=" + totalAmount + '}';
    }
}
