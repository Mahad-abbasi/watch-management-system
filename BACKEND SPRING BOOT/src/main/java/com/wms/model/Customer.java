package com.wms.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer customerId;

    @Column(name = "FullName", nullable = false, length = 150)
    private String fullName;

    @Column(name = "EmailAddress", nullable = false, unique = true, length = 150)
    private String emailAddress;

    @Column(name = "PhoneCoordinates", length = 50)
    private String phoneCoordinates;

    @Column(name = "Location", length = 150)
    private String location;

    @Column(name = "Tier", length = 50)
    private String tier = "Gold Tier";

    @Column(name = "LoyaltyPoints")
    private Integer loyaltyPoints = 0;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Customer() {}

    // Getters & Setters
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer id) { this.customerId = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmailAddress() { return emailAddress; }
    public void setEmailAddress(String email) { this.emailAddress = email; }
    public String getPhoneCoordinates() { return phoneCoordinates; }
    public void setPhoneCoordinates(String phone) { this.phoneCoordinates = phone; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public Integer getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer pts) { this.loyaltyPoints = pts; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}