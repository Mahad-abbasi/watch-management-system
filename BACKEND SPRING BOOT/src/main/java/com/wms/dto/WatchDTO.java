package com.wms.dto;

import java.math.BigDecimal;

public class WatchDTO {
    private String modelName;
    private BigDecimal price;
    private Integer stockQuantity;
    private String color;
    private String imageUrl;
    
    // Nayi fields (Frontend se ID aayegi)
    private Integer brandId;
    private Integer categoryId;

    // Getters and Setters
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getBrandId() { return brandId; }
    public void setBrandId(Integer brandId) { this.brandId = brandId; }
    
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
}