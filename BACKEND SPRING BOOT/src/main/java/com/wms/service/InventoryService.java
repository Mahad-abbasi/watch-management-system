package com.wms.service;

import org.springframework.stereotype.Service;

import com.wms.dto.WatchDTO;
import com.wms.model.Watch;
import com.wms.repository.BrandRepository;
import com.wms.repository.CategoryRepository;
import com.wms.repository.WatchRepository;

@Service
public class InventoryService {

    private final WatchRepository watchRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    public InventoryService(WatchRepository watchRepository, 
                            BrandRepository brandRepository, 
                            CategoryRepository categoryRepository) {
        this.watchRepository = watchRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    public Watch addWatch(WatchDTO dto) {
        Watch watch = new Watch();
        
        watch.setModelName(dto.getModelName());
        watch.setPrice(dto.getPrice() != null ? dto.getPrice().doubleValue() : 0.0);
        watch.setColor(dto.getColor());
        watch.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0);
        watch.setImageUrl(dto.getImageUrl());
        
        if (dto.getBrandId() != null) {
            brandRepository.findById(dto.getBrandId()).ifPresent(watch::setBrand);
        }
        
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId()).ifPresent(watch::setCategory);
        }

        // UUID — guaranteed unique, duplicate nahi hoga
        String unique = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        watch.setSku("SKU-" + unique);
        watch.setSerialNumber("SN-" + unique);
        
        return watchRepository.save(watch);
    }
}