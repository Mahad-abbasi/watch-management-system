package com.wms.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "repairs")
public class Repair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repairid")
    private Integer repairId;

    @Column(name = "watch_model", nullable = false, length = 150)
    private String watchModel;

    @Column(name = "problem_description", columnDefinition = "TEXT")
    private String problemDescription;

    @Column(name = "priority", length = 50)
    private String priority = "Normal";

    @Column(name = "repair_status", length = 50)
    private String repairStatus = "In Diagnosis";

    @Column(name = "service_cost", precision = 10, scale = 2)
    private BigDecimal serviceCost = BigDecimal.ZERO;

    @Column(name = "parts_used", length = 255)
    private String partsUsed;

    @Column(name = "customer_name", length = 150)
    private String customerName;

    @Column(name = "customer_phone", length = 50)
    private String customerPhone;

    // completion_date — optional field
    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    // created_date — set automatically
    @Column(name = "created_date")
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "technicianid", nullable = true)
    private Technician technician;

    public Repair() {}

    // Getters & Setters
    public Integer getRepairId() { return repairId; }
    public void setRepairId(Integer id) { this.repairId = id; }

    public String getWatchModel() { return watchModel; }
    public void setWatchModel(String watchModel) { this.watchModel = watchModel; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getRepairStatus() { return repairStatus; }
    public void setRepairStatus(String repairStatus) { this.repairStatus = repairStatus; }

    public BigDecimal getServiceCost() { return serviceCost; }
    public void setServiceCost(BigDecimal serviceCost) { this.serviceCost = serviceCost; }

    public String getPartsUsed() { return partsUsed; }
    public void setPartsUsed(String partsUsed) { this.partsUsed = partsUsed; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public LocalDateTime getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDateTime completionDate) { this.completionDate = completionDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Technician getTechnician() { return technician; }
    public void setTechnician(Technician technician) { this.technician = technician; }
}