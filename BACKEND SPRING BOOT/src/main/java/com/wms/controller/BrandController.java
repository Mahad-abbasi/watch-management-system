package com.wms.controller; // This file handles HTTP requests related to "Brands"
// --- IMPORTS: Bringing in Spring Framework tools ---
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wms.model.Brand;
import com.wms.repository.BrandRepository;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = {
    "http://localhost:5173","http://localhost:5174",
    "http://localhost:5175","http://localhost:5176","http://localhost:5178"
})
public class BrandController {
    @Autowired private BrandRepository brandRepository;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
}