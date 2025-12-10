package com.master.pos.pos_backend.repository;

import com.master.pos.pos_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
