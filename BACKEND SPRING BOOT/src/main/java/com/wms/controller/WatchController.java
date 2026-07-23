package com.wms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wms.dto.WatchDTO;
import com.wms.model.Watch;
import com.wms.repository.BrandRepository;
import com.wms.repository.CategoryRepository;
import com.wms.repository.WatchRepository;
import com.wms.service.InventoryService;

@RestController
@RequestMapping("/api/watches")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5178"
})
public class WatchController {

    @Autowired private WatchRepository watchRepository;
    @Autowired private BrandRepository brandRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private InventoryService inventoryService;

    // 1. SEARCH ROUTE (Placed first to avoid ID conflict)
    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<Watch>> searchWatches(@RequestParam String query) {
        System.out.println("DEBUG: Received search request for: " + query);
        List<Watch> results = watchRepository.findByModelNameContainingIgnoreCaseOrSerialNumberContainingIgnoreCase(query, query);
        System.out.println("DEBUG: Found " + results.size() + " results.");
        return ResponseEntity.ok(results);
    }

    // 2. GET ALL ROUTE
    @GetMapping
    public ResponseEntity<List<Watch>> getAllWatches() {
        return ResponseEntity.ok(watchRepository.findAll());
    }

    // 3. GET BY ID ROUTE
    @GetMapping("/{id}")
    public ResponseEntity<Watch> getWatchById(@PathVariable Long id) {  // ✅ Integer → Long
        return watchRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Watch> addWatch(@RequestBody WatchDTO watchDTO) {
        Watch saved = inventoryService.addWatch(watchDTO);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Watch> updateWatch(@PathVariable Long id, @RequestBody WatchDTO dto) {  // ✅ Integer → Long
        return watchRepository.findById(id).map(watch -> {
            watch.setModelName(dto.getModelName());
            watch.setPrice(dto.getPrice() != null ? dto.getPrice().doubleValue() : watch.getPrice());
            watch.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : watch.getStockQuantity());
            watch.setColor(dto.getColor());
            watch.setImageUrl(dto.getImageUrl());
            if (dto.getBrandId() != null) {
                brandRepository.findById(dto.getBrandId()).ifPresent(watch::setBrand);
            }
            if (dto.getCategoryId() != null) {
                categoryRepository.findById(dto.getCategoryId()).ifPresent(watch::setCategory);
            }
            return ResponseEntity.ok(watchRepository.save(watch));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWatch(@PathVariable Long id) {  // ✅ Integer → Long
        if (!watchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        watchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}