package com.master.pos.pos_backend.controller;

import com.master.pos.pos_backend.entity.Customer;
import com.master.pos.pos_backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer newData) {
        Customer c = customerRepository.findById(id).orElse(null);
        if (c != null) {
            c.setName(newData.getName());
            c.setEmail(newData.getEmail());
            c.setPhone(newData.getPhone());
            c.setAddress(newData.getAddress());
        }
        return customerRepository.save(c);
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable Long id) {
        customerRepository.deleteById(id);
        return "Customer deleted";
    }
}
