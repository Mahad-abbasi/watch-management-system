package com.wms.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Message", length = 500)
    private String message;

    @Column(name = "Type", length = 50) // LOW_STOCK, ORDER, LOYALTY
    private String type;

    @Column(name = "IsRead")
    private Boolean isRead = false;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(String message, String type) {
        this.message = message;
        this.type = type;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}