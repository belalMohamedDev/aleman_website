import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useAddresses } from '../features/profile/useAddresses';
import { useVehicles } from '../features/profile/useVehicles';
import { useMyOrders } from '../features/profile/useMyOrders';
import { useMerchantOrders } from '../features/profile/useMerchantOrders';
import { useCustomers } from '../features/profile/useCustomers';
import type { ProfileTabType } from '../features/profile/types';

import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileTabs } from '../components/profile/ProfileTabs';
import { OrdersTab } from '../components/profile/OrdersTab';
import { MerchantOrdersTab } from '../components/profile/MerchantOrdersTab';
import { CustomersTab } from '../components/profile/CustomersTab';
import { AddressesTab } from '../components/profile/AddressesTab';
import { VehiclesTab } from '../components/profile/VehiclesTab';

export function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabType>('orders');

  // Hooks for each feature
  const addressHook = useAddresses(isAuthenticated);
  const vehicleHook = useVehicles(isAuthenticated);
  const myOrdersHook = useMyOrders(isAuthenticated);
  const merchantOrdersHook = useMerchantOrders(isAuthenticated);
  const customersHook = useCustomers(merchantOrdersHook.rawOrders);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      openAuthModal();
      navigate('/');
    }
  }, [isAuthenticated, isAuthLoading, openAuthModal, navigate]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-bold text-slate-400">جاري التحقق من بيانات الحساب...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const counts = {
    orders: myOrdersHook.totalCount,
    merchantOrders: merchantOrdersHook.totalCount,
    customers: customersHook.customersCount,
    addresses: addressHook.addresses.length,
    vehicles: vehicleHook.vehicles.length,
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 pt-24">
      <div className="mx-auto w-full max-w-site px-4 md:px-6">
        {/* User Information & Quick Stats */}
        <ProfileHeader
          user={user}
          stats={{
            ordersCount: counts.orders,
            merchantOrdersCount: counts.merchantOrders,
            customersCount: counts.customers,
            addressesCount: counts.addresses,
            vehiclesCount: counts.vehicles,
          }}
        />

        {/* Tab Navigation */}
        <ProfileTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          counts={counts}
        />

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={myOrdersHook.orders}
            isLoading={myOrdersHook.isLoading}
            statusFilter={myOrdersHook.statusFilter}
            onSelectStatus={myOrdersHook.setStatusFilter}
            onCancelOrder={myOrdersHook.cancelOrder}
          />
        )}

        {activeTab === 'merchant-orders' && (
          <MerchantOrdersTab
            orders={merchantOrdersHook.orders}
            isLoading={merchantOrdersHook.isLoading}
            statusFilter={merchantOrdersHook.statusFilter}
            onSelectStatus={merchantOrdersHook.setStatusFilter}
            searchTerm={merchantOrdersHook.searchTerm}
            onSearchChange={merchantOrdersHook.setSearchTerm}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersTab
            customers={customersHook.customers}
            searchQuery={customersHook.searchQuery}
            onSearchChange={customersHook.setSearchQuery}
            totalRevenue={customersHook.totalRevenue}
            totalTons={customersHook.totalTons}
            customersCount={customersHook.customersCount}
          />
        )}

        {activeTab === 'addresses' && (
          <AddressesTab
            addresses={addressHook.addresses}
            isLoading={addressHook.isLoading}
            onAddAddress={addressHook.addAddress}
            onRemoveAddress={addressHook.removeAddress}
            onMakeDefault={addressHook.makeDefault}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesTab
            vehicles={vehicleHook.vehicles}
            isLoading={vehicleHook.isLoading}
            onAddVehicle={vehicleHook.addVehicle}
            onRemoveVehicle={vehicleHook.removeVehicle}
            onMakeDefault={vehicleHook.makeDefault}
          />
        )}
      </div>
    </div>
  );
}
