package com.wms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wms.model.Customer;
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}