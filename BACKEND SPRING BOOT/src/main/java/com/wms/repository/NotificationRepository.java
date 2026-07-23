package com.wms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wms.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
    long countByIsReadFalse();
}