package com.wms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.wms.model.Repair;

public interface RepairRepository extends JpaRepository<Repair, Integer> {

    @Query(value = "SELECT COUNT(*) FROM Repairs WHERE repair_status <> 'Completed'", nativeQuery = true)
    long countActiveRepairs();
}