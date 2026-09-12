import type { OrderResponse, CustomerSummary } from './types';

export const customerService = {
  extractCustomersFromOrders(orders: OrderResponse[]): CustomerSummary[] {
    const map = new Map<string, CustomerSummary>();

    for (const order of orders) {
      const name = (order.customerName || 'عميل غير مسمى').trim();
      const existing = map.get(name);

      const orderAmount = order.totalAmount || 0;
      const orderTons = order.totalWeightTons || (order.totalWeightKg ? order.totalWeightKg / 1000 : 0);
      const orderDate = order.createdAt;

      if (!existing) {
        map.set(name, {
          name,
          ordersCount: 1,
          totalTons: orderTons,
          totalAmount: orderAmount,
          lastOrderDate: orderDate,
          lastOrderNumber: order.orderNumber,
          orders: [order],
        });
      } else {
        existing.ordersCount += 1;
        existing.totalTons += orderTons;
        existing.totalAmount += orderAmount;
        existing.orders.push(order);
        
        if (new Date(orderDate) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = orderDate;
          existing.lastOrderNumber = order.orderNumber;
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  },
};
