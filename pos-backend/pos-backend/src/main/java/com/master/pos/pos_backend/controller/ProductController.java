package com.master.pos.pos_backend.controller;

import com.master.pos.pos_backend.entity.Product;
import com.master.pos.pos_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product newData) {
        Product p = productRepository.findById(id).orElse(null);
        if (p != null) {
            p.setName(newData.getName());
            p.setPrice(newData.getPrice());
            p.setQuantity(newData.getQuantity());
        }
        return productRepository.save(p);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return "Product deleted";
    }
}
