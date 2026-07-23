// Watch.java — MAIN ENTITY — Sabse Zyada DB Concepts Yahan Hain!
// DB: Watches TABLE jo Brands aur Categories se linked hai
// RELATIONSHIP CONCEPT: Many-to-One (ManyToOne)
// ============================================================
package com.wms.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Watches")
public class Watch implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WatchID")
    private Long watchId;  // ✅ Integer → Long

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BrandID", nullable = true)
    private Brand brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID", nullable = true)
    private Category category;

    @Column(name = "ModelName", length = 300)
    private String modelName;

    @Column(name = "SKU", length = 200)
    private String sku;

    @Column(name = "SerialNumber", length = 200)
    private String serialNumber;

    @Column(name = "PriceUSD")
    private Double price;

    @Column(name = "StockQuantity")
    private Integer stockQuantity;

    @Column(name = "Color", length = 50)
    private String color;

    @Column(name = "ImageUrl", length = 1000)
    private String imageUrl;

    public Watch() {}

    public Long getWatchId() { return watchId; }           // ✅ Integer → Long
    public void setWatchId(Long watchId) { this.watchId = watchId; }  // ✅

    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}