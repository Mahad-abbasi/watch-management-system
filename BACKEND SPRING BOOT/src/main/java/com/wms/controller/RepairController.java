package com.wms.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

import com.wms.model.Repair;
import com.wms.repository.RepairRepository;
import com.wms.repository.TechnicianRepository;

@RestController
@RequestMapping("/api/repairs")
public class RepairController {

    @Autowired private RepairRepository repairRepository;
    @Autowired private TechnicianRepository technicianRepository;

    @GetMapping
    public List<Repair> getAll() {
        return repairRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repair> getById(@PathVariable Integer id) {
        return repairRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Repair> create(@RequestBody Map<String, Object> body) {
        try {
            Repair repair = new Repair();
            repair.setWatchModel((String) body.get("watchModel"));
            repair.setProblemDescription((String) body.get("problemDescription"));
            repair.setPriority(body.getOrDefault("priority", "Normal").toString());
            repair.setCustomerName((String) body.get("customerName"));
            repair.setCustomerPhone((String) body.get("customerPhone"));
            repair.setPartsUsed((String) body.get("partsUsed"));

            // ✅ FIX — frontend "repairStatus" aur "status" dono handle karo
            String status = body.containsKey("repairStatus")
                    ? body.get("repairStatus").toString()
                    : body.getOrDefault("status", "In Diagnosis").toString();
            repair.setRepairStatus(status);

            if (body.get("serviceCost") != null) {
                repair.setServiceCost(new BigDecimal(body.get("serviceCost").toString()));
            }

            Object techIdObj = body.get("technicianId");
            if (techIdObj != null && !techIdObj.toString().isBlank()) {
                Integer techId = Integer.parseInt(techIdObj.toString());
                technicianRepository.findById(techId).ifPresent(repair::setTechnician);
            }

            return ResponseEntity.ok(repairRepository.save(repair));
        } catch (Exception e) {
            System.err.println("Repair create failed: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Repair> update(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {
        return repairRepository.findById(id).map(repair -> {
            if (body.get("watchModel") != null)
                repair.setWatchModel((String) body.get("watchModel"));
            if (body.get("problemDescription") != null)
                repair.setProblemDescription((String) body.get("problemDescription"));
            if (body.get("priority") != null)
                repair.setPriority((String) body.get("priority"));
            if (body.get("partsUsed") != null)
                repair.setPartsUsed((String) body.get("partsUsed"));
            if (body.get("customerName") != null)
                repair.setCustomerName((String) body.get("customerName"));
            if (body.get("customerPhone") != null)
                repair.setCustomerPhone((String) body.get("customerPhone"));
            if (body.get("serviceCost") != null)
                repair.setServiceCost(new BigDecimal(body.get("serviceCost").toString()));

            // ✅ FIX — same as POST, dono field names handle karo
            String status = body.containsKey("repairStatus")
                    ? body.get("repairStatus").toString()
                    : body.containsKey("status")
                        ? body.get("status").toString()
                        : null;
            if (status != null) repair.setRepairStatus(status);

            Object techIdObj = body.get("technicianId");
            if (techIdObj != null && !techIdObj.toString().isBlank()) {
                Integer techId = Integer.parseInt(techIdObj.toString());
                technicianRepository.findById(techId).ifPresent(repair::setTechnician);
            } else {
                repair.setTechnician(null);
            }

            return ResponseEntity.ok(repairRepository.save(repair));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!repairRepository.existsById(id)) return ResponseEntity.notFound().build();
        repairRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}