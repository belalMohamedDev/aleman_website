import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { isSubCustomer } from '../features/auth/userUtils';
import { useAddresses } from '../features/profile/useAddresses';
import { useVehicles } from '../features/profile/useVehicles';
import { useMyOrders } from '../features/profile/useMyOrders';
import { useMerchantOrders } from '../features/profile/useMerchantOrders';
import { useCustomers } from '../features/profile/useCustomers';
import type { ProfileTabType } from '../features/profile/types';

import { ProfileSidebar } from '../components/profile/ProfileSidebar';
import { OrdersTab } from '../components/profile/OrdersTab';
import { MerchantOrdersTab } from '../components/profile/MerchantOrdersTab';
import { CustomersTab } from '../components/profile/CustomersTab';
import { AddressesTab } from '../components/profile/AddressesTab';
import { VehiclesTab } from '../components/profile/VehiclesTab';

export function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTabType>('orders');
  const isSub = isSubCustomer(user);

  // Hooks for each feature
  const addressHook = useAddresses(isAuthenticated);
  const vehicleHook = useVehicles(isAuthenticated);
  const myOrdersHook = useMyOrders(isAuthenticated);
  const merchantOrdersHook = useMerchantOrders(isAuthenticated && !isSub);
  const customersHook = useCustomers(isSub ? [] : merchantOrdersHook.rawOrders);

  // If sub-customer, ensure they don't stay on merchant-only tabs
  useEffect(() => {
    if (isSub && (activeTab === 'merchant-orders' || activeTab === 'customers')) {
      setActiveTab('orders');
    }
  }, [isSub, activeTab]);

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

  const getTabTitle = () => {
    switch (activeTab) {
      case 'orders':
        return 'الطلبات';
      case 'merchant-orders':
        return 'طلبات عملائي';
      case 'customers':
        return 'قاعدة عملائي';
      case 'addresses':
        return 'العناوين المحفوظة';
      case 'vehicles':
        return 'أسطول السيارات والسائقين';
      default:
        return 'لوحة التحكم';
    }
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 pt-24">
      <div className="mx-auto w-full max-w-site px-4 md:px-6">
        {/* Noon-Style Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Right Column: Sidebar (User identity card + Navigation menu) */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28">
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              counts={counts}
              isSubCustomer={isSub}
            />
          </aside>

          {/* Left Column: Main Content Area */}
          <main className="lg:col-span-8 xl:col-span-9 min-w-0">
            {/* Top Page Header Title (Like Noon) */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between pb-3 border-b border-slate-200/80">
              <h1 className="text-xl sm:text-2xl font-black text-ink">
                {getTabTitle()}
              </h1>
            </div>

            {/* Tab Contents */}
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
          </main>
        </div>
      </div>
    </div>
  );
}
