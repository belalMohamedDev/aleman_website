import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from './orderService';
import { vehicleService } from '../profile/vehicleService';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { OrderType, PaymentMethod, TruckType, CalculateShippingResponseDto } from './types';
import type { UserAddress, CreateAddressDto, ShippingPromotionInfoDto, CreateOrderRequestDto } from './types';
import type { UserVehicle, CreateVehicleDto } from '../profile/types';
import { toast } from 'sonner';

export function getRecommendedTruckType(weightTons: number): TruckType {
  if (weightTons <= 2) {
    return TruckType.Dababa;
  }
  if (weightTons <= 7) {
    return TruckType.Jumbo;
  }
  return TruckType.Trela;
}

export function useCheckout() {
  const navigate = useNavigate();
  const { items, totalPrice, totalWeightTons, clearCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [orderType, setOrderType] = useState<OrderType>(OrderType.Delivery);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CashOnDelivery);

  // Address State
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
    label: '',
    city: '',
    street: '',
    district: '',
    notes: '',
  });

  // Shipping & Truck (Auto-calculated based on payload weight)
  const [truckType, setTruckType] = useState<TruckType>(() =>
    getRecommendedTruckType(totalWeightTons)
  );
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [shippingCalculation, setShippingCalculation] = useState<CalculateShippingResponseDto | null>(null);
  const [truckPromotions, setTruckPromotions] = useState<Record<number, ShippingPromotionInfoDto | null>>({});
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Automatically update truckType when totalWeightTons changes
  useEffect(() => {
    setTruckType(getRecommendedTruckType(totalWeightTons));
  }, [totalWeightTons]);

  // Query promotions for all truck types when address is selected
  useEffect(() => {
    if (orderType === OrderType.Delivery && selectedAddressId) {
      Promise.all([
        orderService.calculateShipping({ addressId: selectedAddressId, truckType: TruckType.Dababa }).catch(() => null),
        orderService.calculateShipping({ addressId: selectedAddressId, truckType: TruckType.Jumbo }).catch(() => null),
        orderService.calculateShipping({ addressId: selectedAddressId, truckType: TruckType.Trela }).catch(() => null),
      ]).then(([dababaRes, jumboRes, trelaRes]) => {
        setTruckPromotions({
          [TruckType.Dababa]: dababaRes?.promotion ?? null,
          [TruckType.Jumbo]: jumboRes?.promotion ?? null,
          [TruckType.Trela]: trelaRes?.promotion ?? null,
        });
      });
    } else {
      setTruckPromotions({});
    }
  }, [orderType, selectedAddressId]);

  // Pickup Details & Saved Vehicles State
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Manual Pickup Details
  const [driverName, setDriverName] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [saveVehicle, setSaveVehicle] = useState(false);
  const [expectedPickupDate, setExpectedPickupDate] = useState('');

  // General
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch addresses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      orderService.getAddresses()
        .then((data) => {
          setAddresses(data);
          if (data.length > 0) {
            const def = data.find((a) => a.isDefault) || data[0];
            setSelectedAddressId(def.id);
          } else {
            setIsAddingNewAddress(true);
          }
        })
        .catch(() => {
          setIsAddingNewAddress(true);
        });
    } else {
      setIsAddingNewAddress(true);
    }
  }, [isAuthenticated]);

  // Fetch user vehicles if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingVehicles(true);
      vehicleService.getVehicles()
        .then((data) => {
          setVehicles(data);
          if (data.length > 0) {
            const def = data.find((v) => v.isDefault) || data[0];
            setSelectedVehicleId(def.id);
          }
        })
        .finally(() => setIsLoadingVehicles(false));
    } else {
      setVehicles([]);
      setSelectedVehicleId(null);
    }
  }, [isAuthenticated]);

  // Recalculate shipping when address or truck changes
  useEffect(() => {
    if (orderType === OrderType.Delivery && selectedAddressId) {
      setIsCalculatingShipping(true);
      orderService.calculateShipping({
        addressId: selectedAddressId,
        truckType,
      })
        .then((res) => {
          setShippingCalculation(res);
          setShippingFee(res.shippingFee ?? 0);
          setTruckPromotions((prev) => ({ ...prev, [truckType]: res.promotion ?? null }));
        })
        .catch(() => {
          // Standard estimate if backend calculation requires specific routing
          setShippingCalculation(null);
          setShippingFee(500);
        })
        .finally(() => setIsCalculatingShipping(false));
    } else {
      setShippingCalculation(null);
      setShippingFee(0);
    }
  }, [orderType, selectedAddressId, truckType]);

  const handleSaveAddress = async () => {
    if (!newAddress.city || !newAddress.street) {
      toast.error('يرجى ملء بيانات المدينة والشارع للعنوان');
      return null;
    }

    try {
      const created = await orderService.createAddress(newAddress);
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setIsAddingNewAddress(false);
      toast.success('تم حفظ العنوان بنجاح');
      return created.id;
    } catch (e: any) {
      toast.error(e?.message || 'فشل حفظ العنوان');
      return null;
    }
  };

  const handleAddAddress = async (data: CreateAddressDto): Promise<boolean> => {
    try {
      const created = await orderService.createAddress(data);
      setAddresses((prev) => {
        if (created.isDefault) {
          return [...prev.map((a) => ({ ...a, isDefault: false })), created];
        }
        return [...prev, created];
      });
      setSelectedAddressId(created.id);
      setIsAddressModalOpen(false);
      setIsAddingNewAddress(false);
      toast.success('تم حفظ العنوان بنجاح');
      return true;
    } catch (e: any) {
      toast.error(e?.message || 'فشل حفظ العنوان');
      return false;
    }
  };

  const handleAddVehicle = async (data: CreateVehicleDto): Promise<boolean> => {
    try {
      const created = await vehicleService.createVehicle(data);
      setVehicles((prev) => {
        if (created.isDefault) {
          return [...prev.map((v) => ({ ...v, isDefault: false })), created];
        }
        return [...prev, created];
      });
      setSelectedVehicleId(created.id);
      setIsVehicleModalOpen(false);
      toast.success('تمت إضافة بيانات السائق والسيارة بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل إضافة بيانات السيارة');
      return false;
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const submitOrder = async () => {
    if (items.length === 0) {
      toast.error('سلة المشتريات فارغة');
      navigate('/products');
      return;
    }

    if (!isAuthenticated) {
      toast.info('يرجى تسجيل الدخول أو إنشاء حساب لإتمام الطلب');
      openAuthModal();
      return;
    }

    setIsSubmitting(true);

    try {
      let finalAddressId = selectedAddressId;

      if (orderType === OrderType.Delivery) {
        if (isAddingNewAddress || !finalAddressId) {
          finalAddressId = await handleSaveAddress();
          if (!finalAddressId) {
            setIsSubmitting(false);
            return;
          }
        }
      }

      if (orderType === OrderType.Pickup) {
        if (!selectedVehicle && (!driverName.trim() || !vehiclePlateNumber.trim())) {
          toast.error('يرجى اختيار سيارة وسائق أو إدخال بيانات السائق ورقم اللوحة');
          setIsSubmitting(false);
          return;
        }
      }

      const orderPayload: CreateOrderRequestDto = {
        orderType,
        addressId: orderType === OrderType.Delivery ? finalAddressId : null,
        truckType: orderType === OrderType.Delivery ? truckType : null,
        truckCount: orderType === OrderType.Delivery ? (shippingCalculation?.requiredTrucksCount || 1) : null,
        vehicleId: orderType === OrderType.Pickup ? (selectedVehicle?.id || null) : null,
        driverName: orderType === OrderType.Pickup ? (selectedVehicle?.driverName || driverName.trim() || null) : null,
        vehiclePlateNumber: orderType === OrderType.Pickup ? (selectedVehicle?.vehiclePlateNumber || vehiclePlateNumber.trim() || null) : null,
        driverLicenseNumber: orderType === OrderType.Pickup ? (selectedVehicle?.driverLicenseNumber || driverLicenseNumber.trim() || null) : null,
        driverPhone: orderType === OrderType.Pickup ? (selectedVehicle?.driverPhone || driverPhone.trim() || null) : null,
        vehicleType: orderType === OrderType.Pickup ? (selectedVehicle?.vehicleType || vehicleType.trim() || null) : null,
        expectedPickupDate: orderType === OrderType.Pickup && expectedPickupDate ? new Date(expectedPickupDate).toISOString() : null,
        saveVehicle: orderType === OrderType.Pickup && !selectedVehicle ? saveVehicle : false,
        paymentMethod,
        notes: notes || undefined,
      };

      const orderResult = await orderService.createOrder(orderPayload);

      toast.success(`تم تأكيد طلبك بنجاح برقم #${orderResult.orderNumber}`);
      clearCart();
      navigate(`/order-success/${orderResult.orderNumber}`);
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تأكيد الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    isAddingNewAddress,
    setIsAddingNewAddress,
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
    selectedVehicle,
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
    vehicleType,
    setVehicleType,
    saveVehicle,
    setSaveVehicle,
    expectedPickupDate,
    setExpectedPickupDate,
    notes,
    setNotes,
    isSubmitting,
    submitOrder,
    totalPrice,
    finalTotal: totalPrice + (orderType === OrderType.Delivery ? shippingFee : 0),
    totalWeightTons,
    items,
  };
}
