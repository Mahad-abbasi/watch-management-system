package com.wms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "Brands") // Maps directly to the Brands table in SSMS
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Matches INT IDENTITY(1,1)
    @Column(name = "BrandID")
    private Integer brandId;

    @NotBlank(message = "Brand name cannot be blank")
    @Column(name = "BrandName", nullable = false, unique = true, length = 100)
    private String brandName;

    // --- CONSTRUCTORS ---
    public Brand() {
    }

    public Brand(String brandName) {
        this.brandName = brandName;
    }

    // --- GETTERS & SETTERS ---
    public Integer getBrandId() {
        return brandId;
    }

    public void setBrandId(Integer brandId) {
        this.brandId = brandId;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
}