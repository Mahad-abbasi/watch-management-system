package com.wms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wms.model.Notification;
import com.wms.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {
    "http://localhost:5173","http://localhost:5174",
    "http://localhost:5175","http://localhost:5176","http://localhost:5178"
})
public class NotificationController {

    @Autowired private NotificationService notificationService;

    @GetMapping("/unread")
    public List<Notification> getUnread() {
        return notificationService.getUnread();
    }

    @GetMapping("/count")
    public long getCount() {
        return notificationService.countUnread();
    }

    @PostMapping("/mark-read")
    public void markAllRead() {
        notificationService.markAllRead();
    }
}
