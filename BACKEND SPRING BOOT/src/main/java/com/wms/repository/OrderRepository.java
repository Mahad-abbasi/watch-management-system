package com.wms.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wms.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {  // ✅ Integer → Long

    @Query(value = "SELECT COALESCE(SUM(TotalAmount), 0) FROM orders WHERE Status = 'Settled'", nativeQuery = true)
    BigDecimal sumTotalRevenue();

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.customer " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.watch " +
           "ORDER BY o.orderId DESC")
    List<Order> findAllWithDetails();

    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.customer " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.watch " +
           "WHERE o.orderId = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Long id);  // ✅ Integer → Long

    @Query(value = "SELECT MONTH(OrderDate) as month, YEAR(OrderDate) as year, " +
                   "COALESCE(SUM(TotalAmount), 0) as revenue " +
                   "FROM orders WHERE Status = 'Settled' " +
                   "GROUP BY YEAR(OrderDate), MONTH(OrderDate) " +
                   "ORDER BY YEAR(OrderDate), MONTH(OrderDate)", nativeQuery = true)
    List<Object[]> getMonthlyRevenue();
}