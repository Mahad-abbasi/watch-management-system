package com.wms.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

import com.wms.model.Order;
import com.wms.model.OrderItem;
import com.wms.model.Watch;
import com.wms.repository.OrderRepository;
import com.wms.repository.WatchRepository;
import com.wms.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private WatchRepository watchRepository;
    @Autowired private OrderService orderService;

    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAllWithDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {  // ✅ Integer → Long
        return orderRepository.findByIdWithDetails(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Map<String, Object> body) {
        try {
            Integer customerId = ((Number) body.get("customerId")).intValue();

            List<Map<String, Object>> itemMaps =
                    (List<Map<String, Object>>) body.get("items");

            if (itemMaps == null || itemMaps.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<OrderItem> items = new ArrayList<>();
            for (Map<String, Object> itemMap : itemMaps) {
                Long watchId = ((Number) itemMap.get("watchId")).longValue();
                Watch watch = watchRepository.findById(watchId)
                        .orElseThrow(() -> new RuntimeException("Watch not found: " + watchId));

                OrderItem item = new OrderItem();
                item.setWatch(watch);
                item.setQuantity(((Number) itemMap.get("quantity")).intValue());
                item.setUnitPrice(new BigDecimal(itemMap.get("unitPrice").toString()));
                items.add(item);
            }

            Order savedOrder = orderService.processOrder(customerId, items);

            Order fullOrder = orderRepository.findByIdWithDetails(savedOrder.getOrderId())
                    .orElse(savedOrder);

            return ResponseEntity.ok(fullOrder);

        } catch (RuntimeException e) {
            System.err.println("Order creation failed: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(
            @PathVariable Long id,  // ✅ Integer → Long
            @RequestBody Map<String, Object> body) {

        return orderRepository.findByIdWithDetails(id).map(order -> {

            if (body.containsKey("status")) {
                order.setStatus((String) body.get("status"));
            }

            Order updated = orderRepository.save(order);

            return ResponseEntity.ok(
                orderRepository.findByIdWithDetails(updated.getOrderId()).orElse(updated)
            );

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {  // ✅ Integer → Long
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}