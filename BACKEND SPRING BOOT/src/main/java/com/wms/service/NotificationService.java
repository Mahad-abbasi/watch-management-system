package com.wms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wms.model.Notification;
import com.wms.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired private NotificationRepository notificationRepository;

    // Save a new notification
    public void send(String message, String type) {
        notificationRepository.save(new Notification(message, type));
    }

    // Get all unread
    public List<Notification> getUnread() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    // Count unread (for badge)
    public long countUnread() {
        return notificationRepository.countByIsReadFalse();
    }

    // Mark all as read
    public void markAllRead() {
        List<Notification> unread = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}