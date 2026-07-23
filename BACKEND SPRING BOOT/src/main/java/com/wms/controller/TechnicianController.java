package com.wms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wms.model.Technician;
import com.wms.repository.TechnicianRepository;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    @Autowired
    private TechnicianRepository technicianRepository;

    // GET all — frontend dropdown + listing ke liye
    @GetMapping
    public List<Technician> getAll() {
        return technicianRepository.findAll();
    }

    // GET only active technicians
    @GetMapping("/active")
    public List<Technician> getActive() {
        return technicianRepository.findByIsActiveTrue();
    }

    // GET single
    @GetMapping("/{id}")
    public ResponseEntity<Technician> getById(@PathVariable Integer id) {
        return technicianRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create
    @PostMapping
    public ResponseEntity<Technician> create(@RequestBody Technician technician) {
        if (technician.getTechName() == null || technician.getTechName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        technician.setTechnicianId(null); // auto-generate ID
        return ResponseEntity.ok(technicianRepository.save(technician));
    }

    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<Technician> update(
            @PathVariable Integer id,
            @RequestBody Technician updated) {
        return technicianRepository.findById(id).map(tech -> {
            tech.setTechName(updated.getTechName());
            tech.setSpecialization(updated.getSpecialization());
            tech.setPhoneNumber(updated.getPhoneNumber());
            tech.setEmail(updated.getEmail());
            tech.setIsActive(updated.getIsActive());
            return ResponseEntity.ok(technicianRepository.save(tech));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!technicianRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        technicianRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
