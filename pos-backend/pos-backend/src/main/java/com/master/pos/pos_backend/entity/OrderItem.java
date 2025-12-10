package com.master.pos.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "order_items")
public class OrderItem implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // price at time of order
    private Double price;

    private Integer quantity;

    // product relation (stores product_id in DB)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    // order relation (stores order_id in DB)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference // prevents infinite recursion when order serializes items
    private OrderEntity order;

    // constructors
    public OrderItem() {}

    public OrderItem(Product product, Double price, Integer quantity) {
        this.product = product;
        this.price = price;
        this.quantity = quantity;
    }

    // getters / setters
    public Long getId() {
        return id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    // set product (used by controller if you load Product entity)
    public void setProduct(Product product) {
        this.product = product;
    }

    public OrderEntity getOrder() {
        return order;
    }

    // used by controller: setOrder(OrderEntity)
    public void setOrder(OrderEntity order) {
        this.order = order;
    }

    // convenience to get product id without accessing product
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }

    @Override
    public String toString() {
        return "OrderItem{" + "id=" + id + ", product=" + (product != null ? product.getName() : "null") + '}';
    }
}
