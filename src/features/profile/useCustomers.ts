import { useState, useMemo } from 'react';
import { customerService } from './customerService';
import type { OrderResponse } from './types';

export function useCustomers(merchantOrders: OrderResponse[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const allCustomers = useMemo(() => {
    return customerService.extractCustomersFromOrders(merchantOrders);
  }, [merchantOrders]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return allCustomers;
    const q = searchQuery.toLowerCase().trim();
    return allCustomers.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCustomers, searchQuery]);

  const totalRevenue = useMemo(() => {
    return allCustomers.reduce((acc, c) => acc + c.totalAmount, 0);
  }, [allCustomers]);

  const totalTons = useMemo(() => {
    return allCustomers.reduce((acc, c) => acc + c.totalTons, 0);
  }, [allCustomers]);

  return {
    customers: filteredCustomers,
    allCustomers,
    searchQuery,
    setSearchQuery,
    totalRevenue,
    totalTons,
    customersCount: allCustomers.length,
  };
}
