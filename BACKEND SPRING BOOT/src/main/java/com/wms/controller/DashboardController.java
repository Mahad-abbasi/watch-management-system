package com.wms.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wms.model.Watch;
import com.wms.repository.OrderRepository;
import com.wms.repository.RepairRepository;
import com.wms.repository.WatchRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5178"
})
public class DashboardController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private RepairRepository repairRepository;
    @Autowired private WatchRepository watchRepository;

    // Month number to name
    private static final String[] MONTH_NAMES = {
        "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    };

    @GetMapping("/analytics")
    public Map<String, Object> getDashboardData() {

        BigDecimal totalSales = orderRepository.sumTotalRevenue();
        if (totalSales == null) totalSales = BigDecimal.ZERO;

        long activeRepairs = repairRepository.countActiveRepairs();

        long inventoryCount = watchRepository.findAll().stream()
                .mapToLong(Watch::getStockQuantity)
                .sum();

        // Cards
        Map<String, Object> cards = new HashMap<>();
        cards.put("sales",     totalSales.doubleValue());
        cards.put("repairs",   activeRepairs);
        cards.put("inventory", inventoryCount);

        // Real monthly revenue from database
        List<Object[]> monthlyData = orderRepository.getMonthlyRevenue();
        List<Map<String, Object>> waveform = new ArrayList<>();

        for (Object[] row : monthlyData) {
            int month = ((Number) row[0]).intValue();
            BigDecimal revenue = new BigDecimal(row[2].toString());

            Map<String, Object> entry = new HashMap<>();
            entry.put("timeline", MONTH_NAMES[month]);
            entry.put("revenue",  revenue.intValue());
            waveform.add(entry);
        }

        // Agar koi data nahi toh empty state
        if (waveform.isEmpty()) {
            waveform.add(Map.of("timeline", "No Data", "revenue", 0));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("cards",    cards);
        response.put("waveform", waveform);

        return response;
    }
}