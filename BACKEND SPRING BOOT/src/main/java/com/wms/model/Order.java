// ============================================================
// Order.java — ENTITY CLASS
// Sabse Complex Entity — Multiple Relationships hain yahan
// DB Concepts: ManyToOne, OneToMany, CascadeType, FetchType
// ============================================================


package com.wms.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID")
    private Long orderId;  // ✅ Integer → Long

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID")
    private Customer customer;

    @Column(name = "OrderDate")
    private LocalDateTime orderDate;

    @Column(name = "TotalAmount")
    private BigDecimal totalAmount;

    @Column(name = "Status")
    private String status;


    // =====================================================
    // DB CONCEPT: ONE-TO-MANY RELATIONSHIP
    // ONE Order mein MANY OrderItems ho sakte hain
    // Yeh REVERSE side hai OrderItem ke ManyToOne ka
    //
    // mappedBy = "order" → OrderItem class mein "order" field FK handle karta hai
    // cascade = ALL → Order delete ho to uske sab items bhi delete hon
    //   CascadeType options:
    //   ALL     = sab operations cascade hon (PERSIST, MERGE, REMOVE, REFRESH)
    //   PERSIST = save karo to items bhi save
    //   REMOVE  = delete karo to items bhi delete
    // fetch = LAZY → Items tab load hon jab zarurat ho
    // =====================================================

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<OrderItem> orderItems;

    public Long getOrderId() { return orderId; }           // ✅ Integer → Long
    public void setOrderId(Long orderId) { this.orderId = orderId; }  // ✅

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}