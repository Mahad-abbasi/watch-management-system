package com.wms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wms.model.Watch;

@Repository
public interface WatchRepository extends JpaRepository<Watch, Long> {  // ✅ Integer → Long

    List<Watch> findByModelNameContainingIgnoreCaseOrSerialNumberContainingIgnoreCase(
        String modelName, String serialNumber
    );
}