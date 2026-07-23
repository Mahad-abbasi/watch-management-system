package com.wms.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.wms.model.Customer;
import com.wms.model.Order;
import com.wms.model.OrderItem;
import com.wms.model.Watch;
import com.wms.repository.CustomerRepository;
import com.wms.repository.OrderItemRepository;
import com.wms.repository.OrderRepository;
import com.wms.repository.WatchRepository;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private WatchRepository watchRepository;   // ✅ NEW — needed for stock check
    @Autowired private NotificationService notificationService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Order processOrder(Integer customerId, List<OrderItem> items) {

        // ─── TRIGGER 1: Customer existence validation ───────────────────
        // Fires before anything — blocks order if customer doesn't exist
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));

        // ─── TRIGGER 2: Stock availability check ────────────────────────
        // Fires before order is saved — blocks if any watch has insufficient stock
        for (OrderItem item : items) {
            Watch watch = watchRepository.findById(item.getWatch().getWatchId())
                    .orElseThrow(() -> new RuntimeException("Watch not found: " + item.getWatch().getWatchId()));

            if (watch.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                    "Insufficient stock for: " + watch.getModelName() +
                    " | Available: " + watch.getStockQuantity() +
                    " | Requested: " + item.getQuantity()
                );
            }
        }

        // ─── Calculate total ─────────────────────────────────────────────
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : items) {
            BigDecimal itemTotal = item.getUnitPrice()
                    .multiply(new BigDecimal(item.getQuantity()));
            total = total.add(itemTotal);
        }

        // ─── Save order ──────────────────────────────────────────────────
        Order order = new Order();
        order.setCustomer(customer);
        order.setTotalAmount(total);
        order.setStatus("Processing");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        orderRepository.flush();
        notificationService.send(
            "🛒 New order #" + savedOrder.getOrderId() + " placed by " + customer.getFullName(),
            "ORDER"
        );    

        // ─── TRIGGER 3: Auto stock deduction ────────────────────────────
        // Fires for each item — deducts stock quantity after order item is saved
        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
            orderItemRepository.flush();

            // Deduct stock from watch
            Watch watch = watchRepository.findById(item.getWatch().getWatchId())
                    .orElseThrow(() -> new RuntimeException("Watch not found during deduction"));

            int newQty = watch.getStockQuantity() - item.getQuantity();
            watch.setStockQuantity(newQty);
            watchRepository.save(watch);

            // ─── TRIGGER 4: Low stock alert ─────────────────────────────
            // Fires right after deduction — warns if stock drops to 5 or below
            if (newQty <= 5) {
                notificationService.send(
                    "⚠️ Low Stock: " + watch.getModelName() + " — only " + newQty + " left!",
                    "LOW_STOCK"
                    );    
                // 🔔 Later: send email/notification here
            }
        }

        // ─── TRIGGER 5: Auto loyalty points ──────────────────────────────
        // Fires after every order — auto-calculates and adds loyalty points
        int pointsEarned = total.divide(new BigDecimal("100"), BigDecimal.ROUND_DOWN).intValue();
        customer.setLoyaltyPoints(customer.getLoyaltyPoints() + pointsEarned);

        // ─── TRIGGER 6: Loyalty tier upgrade ────────────────────────────
        // Fires after points update — auto-upgrades customer tier
        int totalPoints = customer.getLoyaltyPoints();
        if (totalPoints >= 1000) {
            customer.setTier("Gold");
        } else if (totalPoints >= 500) {
            customer.setTier("Silver");
        } else {
            customer.setTier("Bronze");
        }
        notificationService.send(
            "🏅 " + customer.getFullName() + " upgraded to " + customer.getTier() + " tier!",
            "LOYALTY"
        );    
        customerRepository.save(customer);

        return savedOrder;
    }
}