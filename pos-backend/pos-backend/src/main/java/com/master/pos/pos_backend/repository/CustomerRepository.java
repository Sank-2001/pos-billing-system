package com.master.pos.pos_backend.repository;

import com.master.pos.pos_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
