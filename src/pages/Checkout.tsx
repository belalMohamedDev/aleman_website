import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TruckIcon,
  WarehouseIcon,
  BanknoteIcon,
  LandmarkIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  Loader2Icon,
  PlusIcon,
  CalendarIcon,
  PhoneIcon,
  CheckIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { useCheckout, getRecommendedTruckType } from '../features/orders/useCheckout';
import { OrderType, PaymentMethod, TruckType } from '../features/orders/types';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { VehicleModal } from '../components/profile/VehicleModal';
import { AddressModal } from '../components/profile/AddressModal';
import { useLang } from '../i18n/LanguageContext';
import { ui } from '../i18n/ui';

export function Checkout() {
  const { t, dir } = useLang();
  const BackArrow = dir === 'rtl' ? ArrowRightIcon : ArrowLeftIcon;

  const {
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddressModalOpen,
    setIsAddressModalOpen,
    handleAddAddress,
    newAddress,
    setNewAddress,
    truckType,
    setTruckType,
    shippingFee,
    shippingCalculation,
    truckPromotions,
    isCalculatingShipping,
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    isLoadingVehicles,
    isVehicleModalOpen,
    setIsVehicleModalOpen,
    handleAddVehicle,
    driverName,
    setDriverName,
    vehiclePlateNumber,
    setVehiclePlateNumber,
    driverLicenseNumber,
    setDriverLicenseNumber,
    driverPhone,
    setDriverPhone,
    saveVehicle,
    setSaveVehicle,
    expectedPickupDate,
    setExpectedPickupDate,
    notes,
    setNotes,
    isSubmitting,
    submitOrder,
    totalPrice,
    finalTotal,
    totalWeightTons,
    items,
  } = useCheckout();

  const { isAuthenticated, openAuthModal } = useAuth();
  const { totalItemsCount } = useCart();
  const [showItemsDetails, setShowItemsDetails] = useState(false);

  const truckTypesConfig = [
    {
      type: TruckType.Dababa,
      name: t(ui.checkout.truckDababaName),
      capacityLabel: t(ui.checkout.truckDababaCap),
      maxCapacityTons: 2,
      description: t(ui.checkout.truckDababaDesc),
    },
    {
      type: TruckType.Jumbo,
      name: t(ui.checkout.truckJumboName),
      capacityLabel: t(ui.checkout.truckJumboCap),
      maxCapacityTons: 7,
      description: t(ui.checkout.truckJumboDesc),
    },
    {
      type: TruckType.Trela,
      name: t(ui.checkout.truckTrelaName),
      capacityLabel: t(ui.checkout.truckTrelaCap),
      maxCapacityTons: 25,
      description: t(ui.checkout.truckTrelaDesc),
    },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center pt-28">
        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 relative flex items-center justify-center mb-4">
          <img
            src="/aleman_parallax_assets/emptyCart.webp"
            alt={t(ui.cart.emptyTitle)}
            className="w-full h-full object-contain filter drop-shadow-lg animate-in fade-in zoom-in-95 duration-300"
            loading="eager"
            decoding="async"
          />
        </div>
        <h2 className="text-2xl font-black text-ink">{t(ui.cart.emptyTitle)}</h2>
        <p className="text-sm font-semibold text-slate-500 mt-1.5 max-w-sm">
          {t(ui.cart.emptyBody)}
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-600 transition"
        >
          <span>{t(ui.cart.startShopping)}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition mb-2"
          >
            <BackArrow className="h-4 w-4" />
            <span>{t(ui.common.back)}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-ink">{t(ui.checkout.pageTitle)}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            {t(ui.checkout.deliveryOptionDesc)}
          </p>
        </div>

        {/* Auth Notice if not logged in */}
        {!isAuthenticated && (
          <div className="mb-8 flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-extrabold">{t(ui.auth.unauthorizedNotice)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={openAuthModal}
              className="rounded-full bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              {t(ui.auth.loginBtn)}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Order Type Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-black text-ink mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>{t(ui.checkout.orderTypeTitle)}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Option */}
                <label
                  className={`cursor-pointer rounded-[20px] border-[1.5px] p-5 flex flex-col justify-between transition ${
                    orderType === OrderType.Delivery
                      ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                        <TruckIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-ink">{t(ui.checkout.deliveryOption)}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{t(ui.checkout.deliveryOptionDesc)}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === OrderType.Delivery}
                      onChange={() => setOrderType(OrderType.Delivery)}
                      className="h-4 w-4 accent-brand-600"
                    />
                  </div>
                </label>

                {/* Pickup Option */}
                <label
                  className={`cursor-pointer rounded-[20px] border-[1.5px] p-5 flex flex-col justify-between transition ${
                    orderType === OrderType.Pickup
                      ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                        <WarehouseIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-ink">{t(ui.checkout.pickupOption)}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{t(ui.checkout.pickupOptionDesc)}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === OrderType.Pickup}
                      onChange={() => setOrderType(OrderType.Pickup)}
                      className="h-4 w-4 accent-brand-600"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Step 2: Delivery Address or Pickup Details */}
            {orderType === OrderType.Delivery ? (
              <>
                {/* Step 2: Delivery Address Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                        2
                      </span>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5 text-brand-600" />
                        <h2 className="text-base font-black text-ink">{t(ui.checkout.shippingAddressTitle)}</h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-brand-600/30 bg-brand-50/70 hover:bg-brand-100/70 px-3.5 py-1.5 text-xs font-black text-brand-700 transition hover:scale-105 active:scale-95"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      <span>{t(ui.checkout.addNewAddress)}</span>
                    </button>
                  </div>

                  {/* Saved Addresses Cards */}
                  {addresses.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        {addresses.map((addr, index) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={`addr-${addr.id}-${index}`}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`cursor-pointer rounded-[20px] border-[1.5px] p-4 transition ${
                                isSelected
                                  ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                                  : 'border-slate-200/90 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <div
                                    className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition ${
                                      isSelected
                                        ? 'bg-brand-500 text-white shadow-xs'
                                        : 'border-[1.5px] border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-sm font-black text-ink">
                                        {addr.label || `${addr.city}${addr.district ? ` - ${addr.district}` : ''}`}
                                      </span>
                                      {addr.isDefault && (
                                        <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold">
                                          {t(ui.profile.setDefaultAddress)}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600 font-bold">
                                      <MapPinIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                      <span>
                                        {addr.city}
                                        {addr.district ? ` • ${addr.district}` : ''}
                                        {` • ${addr.street}`}
                                      </span>
                                    </div>

                                    {addr.notes && (
                                      <p className="text-xs text-slate-400 font-medium mt-1.5">
                                        {t(ui.common.notes)}: {addr.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <span className="rounded-lg bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-bold">
                                    {addr.city}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/20 p-5 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100/70 text-brand-700 mb-2">
                          <MapPinIcon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">{t(ui.checkout.noSavedAddresses)}</p>
                        <button
                          type="button"
                          onClick={() => setIsAddressModalOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:scale-105 active:scale-95"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                          <span>{t(ui.checkout.addNewAddress)}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {t(ui.profile.cityField)} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">{t(ui.profile.districtField)}</label>
                          <input
                            type="text"
                            value={newAddress.district || ''}
                            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {t(ui.profile.streetField)} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">{t(ui.profile.addressNotesField)}</label>
                          <input
                            type="text"
                            value={newAddress.notes || ''}
                            onChange={(e) => setNewAddress({ ...newAddress, notes: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Truck Selection Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                        3
                      </span>
                      <div className="flex items-center gap-2">
                        <TruckIcon className="h-5 w-5 text-brand-600" />
                        <h2 className="text-base font-black text-ink">{t(ui.checkout.truckSelectionTitle)}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {truckTypesConfig.map((truck) => {
                      const isSelected = truckType === truck.type;
                      const isRecommended = getRecommendedTruckType(totalWeightTons) === truck.type;
                      const exceedsCapacity = totalWeightTons > truck.maxCapacityTons;
                      const neededTrucksCount =
                        isSelected && shippingCalculation?.requiredTrucksCount
                          ? shippingCalculation.requiredTrucksCount
                          : Math.ceil(totalWeightTons / truck.maxCapacityTons);
                      const truckPromo = truckPromotions[truck.type] || (isSelected ? shippingCalculation?.promotion : null);

                      return (
                        <label
                          key={truck.type}
                          onClick={() => setTruckType(truck.type)}
                          className={`relative block rounded-[20px] border-[1.5px] p-4 transition cursor-pointer ${
                            isSelected
                              ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                              : 'border-slate-200/90 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="truckType"
                            checked={isSelected}
                            onChange={() => setTruckType(truck.type)}
                            className="sr-only"
                          />

                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                className={`mt-0.5 h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition ${
                                  isSelected ? 'border-brand-500 bg-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="text-sm font-black text-ink">{truck.name}</span>
                                  {isRecommended && (
                                    <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px] font-extrabold">
                                      {t(ui.checkout.recommendedBadge)}
                                    </span>
                                  )}
                                  {truckPromo && (truckPromo.discountPercentage || truckPromo.discountValue) ? (
                                    <span className="rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 px-2 py-0.5 text-[11px] font-extrabold flex items-center gap-0.5">
                                      {truckPromo.discountPercentage ? `%${truckPromo.discountPercentage}` : `${truckPromo.discountValue} ${t(ui.common.currencyEg)}`}
                                    </span>
                                  ) : null}
                                </div>

                                <p className="text-xs text-slate-500 mt-1">{truck.description}</p>

                                {exceedsCapacity ? (
                                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-orange-50/90 border border-orange-200/90 px-3 py-1.5 text-xs font-bold text-orange-900">
                                    <AlertCircleIcon className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                                    <span>
                                      {totalWeightTons} {t(ui.common.ton)} ({neededTrucksCount})
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                                    <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <span>{totalWeightTons} {t(ui.common.ton)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div
                              className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition ${
                                isSelected ? 'bg-brand-100/70 text-brand-700' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <TruckIcon className="h-5 w-5" />
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Factory Pickup Details */
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                      2
                    </span>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-brand-600" />
                      <h2 className="text-base font-black text-ink">{t(ui.checkout.pickupDetailsTitle)}</h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-brand-600/30 bg-brand-50/70 hover:bg-brand-100/70 px-3.5 py-1.5 text-xs font-black text-brand-700 transition hover:scale-105 active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                    <span>{t(ui.checkout.addNewVehicle)}</span>
                  </button>
                </div>

                {isLoadingVehicles ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400 bg-slate-50/50 rounded-2xl">
                    {t(ui.common.loading)}
                  </div>
                ) : vehicles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {vehicles.map((v, index) => {
                        const isSelected = selectedVehicleId === v.id;
                        return (
                          <div
                            key={`veh-${v.id}-${index}`}
                            onClick={() => setSelectedVehicleId(v.id)}
                            className={`cursor-pointer rounded-[20px] border-[1.5px] p-4 transition ${
                              isSelected
                                ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                                : 'border-slate-200/90 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div
                                  className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition ${
                                    isSelected
                                      ? 'bg-brand-500 text-white shadow-xs'
                                      : 'border-[1.5px] border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <CheckIcon className="h-3.5 w-3.5 stroke-[3]" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-black text-ink">{v.driverName}</span>
                                    {v.isDefault && (
                                      <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold">
                                        {t(ui.profile.setDefaultVehicle)}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-700 px-2.5 py-1 font-extrabold">
                                      <span>{v.vehiclePlateNumber}</span>
                                    </span>

                                    {v.driverPhone && (
                                      <span className="inline-flex items-center gap-1 text-slate-600 font-bold" dir="ltr">
                                        <span>{v.driverPhone}</span>
                                        <PhoneIcon className="h-3.5 w-3.5 text-slate-400" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {v.vehicleType && (
                                <div className="shrink-0">
                                  <span className="rounded-lg bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-bold">
                                    {v.vehicleType}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t(ui.checkout.driverNameLabel)} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={driverName}
                          onChange={(e) => setDriverName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t(ui.checkout.vehiclePlateLabel)} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={vehiclePlateNumber}
                          onChange={(e) => setVehiclePlateNumber(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t(ui.checkout.driverLicenseLabel)}</label>
                        <input
                          type="text"
                          value={driverLicenseNumber}
                          onChange={(e) => setDriverLicenseNumber(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t(ui.checkout.driverPhoneLabel)}</label>
                        <input
                          type="tel"
                          value={driverPhone}
                          onChange={(e) => setDriverPhone(e.target.value)}
                          dir="ltr"
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveVehicle}
                        onChange={(e) => setSaveVehicle(e.target.checked)}
                        className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 accent-brand-600"
                      />
                      <span className="text-xs font-bold text-slate-600">
                        {t(ui.checkout.saveVehicleForFuture)}
                      </span>
                    </label>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs sm:text-sm font-black text-ink mb-2">
                    {t(ui.checkout.expectedPickupDateLabel)}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={expectedPickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setExpectedPickupDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 pl-4 pr-11 text-xs sm:text-sm font-bold text-ink focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition cursor-pointer"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-brand-700" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <h2 className="text-base font-black text-ink mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-black">
                  {orderType === OrderType.Delivery ? 4 : 3}
                </span>
                <span>{t(ui.checkout.paymentMethodTitle)}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                  className={`cursor-pointer rounded-[20px] border-[1.5px] p-4 flex items-center gap-3 transition ${
                    paymentMethod === PaymentMethod.CashOnDelivery
                      ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === PaymentMethod.CashOnDelivery}
                    onChange={() => setPaymentMethod(PaymentMethod.CashOnDelivery)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
                      <BanknoteIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-ink">
                        {t(ui.checkout.cashOnDelivery)}
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {t(ui.checkout.cashOnDeliveryDesc)}
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod(PaymentMethod.BankTransfer)}
                  className={`cursor-pointer rounded-[20px] border-[1.5px] p-4 flex items-center gap-3 transition ${
                    paymentMethod === PaymentMethod.BankTransfer
                      ? 'border-brand-400/70 bg-brand-50/35 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === PaymentMethod.BankTransfer}
                    onChange={() => setPaymentMethod(PaymentMethod.BankTransfer)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-700 flex items-center justify-center shrink-0">
                      <LandmarkIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-ink">
                        {t(ui.checkout.bankTransfer)}
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {t(ui.checkout.bankTransferDesc)}
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Notes */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">{t(ui.checkout.additionalNotesTitle)}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t(ui.checkout.notesPlaceholder)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/80 sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-2xs">
                    <ShoppingBagIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-ink">
                      {t(ui.checkout.orderSummary)}
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 block mt-1">
                      {totalItemsCount} {t(ui.common.bag)} • {items.length} {t(ui.common.actions)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/cart"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50/60 hover:bg-brand-50 px-2.5 py-1 rounded-xl transition"
                >
                  {t(ui.common.edit)}
                </Link>
              </div>

              {/* Payload Weight Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                    <TruckIcon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-emerald-950">{t(ui.cart.totalWeight)}:</span>
                </div>
                <span className="font-black text-emerald-900 text-sm">
                  {totalWeightTons} {t(ui.common.ton)}
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{t(ui.checkout.productsSubtotal)}:</span>
                  <span className="font-black text-ink">{totalPrice.toLocaleString()} {t(ui.common.currencyEg)}</span>
                </div>

                {orderType === OrderType.Delivery && (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>{t(ui.checkout.truckSelectionTitle)}:</span>
                      <span className="font-black text-ink">
                        {truckType === TruckType.Dababa
                          ? t(ui.checkout.truckDababaName)
                          : truckType === TruckType.Jumbo
                            ? t(ui.checkout.truckJumboName)
                            : t(ui.checkout.truckTrelaName)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>{t(ui.checkout.shippingFee)}:</span>
                      <span className="font-black text-ink">
                        {isCalculatingShipping ? t(ui.checkout.calculatingShipping) : `${shippingFee.toLocaleString()} ${t(ui.common.currencyEg)}`}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center text-base font-black text-ink pt-3.5 border-t border-slate-200">
                  <span>{t(ui.checkout.finalTotal)}:</span>
                  <span className="text-xl sm:text-2xl text-brand-600">{finalTotal.toLocaleString()} {t(ui.common.currencyEg)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={submitOrder}
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 py-4 px-6 text-base font-black text-white shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01] active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="h-5 w-5 animate-spin" />
                    <span>{t(ui.checkout.submittingOrder)}</span>
                  </>
                ) : (
                  <>
                    <span>{t(ui.checkout.submitOrder)}</span>
                    <CheckCircle2Icon className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Compact Items Peek Accordion */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowItemsDetails(!showItemsDetails)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-ink transition py-1"
                >
                  <span>{t(ui.cart.totalItems)} ({items.length})</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showItemsDetails ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showItemsDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-2 pt-2.5"
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
                        >
                          <div className="min-w-0 pr-1">
                            <p className="font-bold text-slate-800 line-clamp-1">{item.productName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">
                              {item.quantity} {t(ui.common.bag)} × {item.unitPrice.toLocaleString()} {t(ui.common.currencyEg)}
                            </p>
                          </div>
                          <span className="font-black text-brand-700 text-xs shrink-0">
                            {item.subtotal.toLocaleString()} {t(ui.common.currencyEg)}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle & Driver Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSubmit={handleAddVehicle}
      />

      {/* Add Delivery Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddAddress}
      />
    </div>
  );
}
