package com.wms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wms.model.Technician;

public interface TechnicianRepository extends JpaRepository<Technician, Integer> {
    // Active technicians — RepairCenter dropdown ke liye
    List<Technician> findByIsActiveTrue();
}