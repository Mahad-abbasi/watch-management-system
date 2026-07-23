package com.wms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wms.model.Category;
import com.wms.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {
    "http://localhost:5173","http://localhost:5174",
    "http://localhost:5175","http://localhost:5176","http://localhost:5178"
})
public class CategoryController {
    @Autowired private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}