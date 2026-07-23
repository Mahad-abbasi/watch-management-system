import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Core Application Pages
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory'; // Renamed from Watches to match your UI
import Customers from '../pages/Customers';
import OrdersSales from '../pages/OrdersSales';
import RepairCenter from '../pages/RepairCenter';
import Payments from '../pages/Payments';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Primary Dashboard Hub */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Inventory Management (Maps directly to WatchController backend data) */}
      <Route path="/inventory" element={<Inventory />} />

      {/* Customer CRM Module */}
      <Route path="/customer-crm" element={<Customers />} />

      {/* Transaction & Fulfilment Systems */}
      <Route path="/orders-sales" element={<OrdersSales />} />
      <Route path="/repair-center" element={<RepairCenter />} />
      <Route path="/payments" element={<Payments />} />

      {/* Global Fallback for unmatched URLs */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;