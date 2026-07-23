package com.wms.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "technicians")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "technicianid")
    private Integer technicianId;

    // ✅ DB column: tech_name
    @Column(name = "tech_name", nullable = false, length = 150)
    private String techName;

    // ✅ DB column: specialization
    @Column(name = "specialization", length = 150)
    private String specialization;

    // ✅ DB column: PhoneNumber (newly added)
    @Column(name = "PhoneNumber", length = 50)
    private String phoneNumber;

    // ✅ DB column: Email (newly added)
    @Column(name = "Email", length = 150)
    private String email;

    // ✅ DB column: IsActive (newly added)
    @Column(name = "IsActive")
    private Boolean isActive = true;

    // ✅ DB column: CreatedAt (newly added)
    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Technician() {}

    public Integer getTechnicianId() { return technicianId; }
    public void setTechnicianId(Integer id) { this.technicianId = id; }

    public String getTechName() { return techName; }
    public void setTechName(String techName) { this.techName = techName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}