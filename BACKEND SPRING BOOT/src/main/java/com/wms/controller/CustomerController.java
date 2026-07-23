package com.wms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wms.dto.CustomerDTO;
import com.wms.model.Customer;
import com.wms.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5178"
})
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Integer id) {
        return customerRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Customer> addCustomer(@RequestBody CustomerDTO dto) {
        Customer c = new Customer();
        c.setFullName(dto.getFullName());
        c.setEmailAddress(dto.getEmailAddress());
        c.setPhoneCoordinates(dto.getPhoneCoordinates());
        c.setLocation(dto.getLocation());
        c.setTier(dto.getTier() != null ? dto.getTier() : "Gold Tier");
        c.setLoyaltyPoints(dto.getLoyaltyPoints() != null ? dto.getLoyaltyPoints() : 0);
        return ResponseEntity.ok(customerRepository.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Integer id, @RequestBody CustomerDTO dto) {
        return customerRepository.findById(id).map(c -> {
            c.setFullName(dto.getFullName());
            c.setEmailAddress(dto.getEmailAddress());
            c.setPhoneCoordinates(dto.getPhoneCoordinates());
            c.setLocation(dto.getLocation());
            if (dto.getTier() != null) c.setTier(dto.getTier());
            if (dto.getLoyaltyPoints() != null) c.setLoyaltyPoints(dto.getLoyaltyPoints());
            return ResponseEntity.ok(customerRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        if (!customerRepository.existsById(id)) return ResponseEntity.notFound().build();
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}