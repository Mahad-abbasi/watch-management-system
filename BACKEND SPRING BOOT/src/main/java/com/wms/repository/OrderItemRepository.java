package com.wms.repository;

import com.wms.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    // Basic CRUD queries are inherited smoothly from the super node mapping
}