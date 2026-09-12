import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from './orderService';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { OrderType, PaymentMethod, TruckType } from './types';
import type { UserAddress, CreateAddressDto } from './types';
import { toast } from 'sonner';

export function getRecommendedTruckType(weightTons: number): TruckType {
  if (weightTons <= 6) {
    return TruckType.MediumTruck;
  }
  if (weightTons <= 30) {
    return TruckType.HeavyTruck;
  }
  return TruckType.LargeTrailer;
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
  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
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
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Automatically update truckType when totalWeightTons changes
  useEffect(() => {
    setTruckType(getRecommendedTruckType(totalWeightTons));
  }, [totalWeightTons]);

  // Pickup Details
  const [driverName, setDriverName] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');
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

  // Recalculate shipping when address or truck changes
  useEffect(() => {
    if (orderType === OrderType.Delivery && selectedAddressId) {
      setIsCalculatingShipping(true);
      orderService.calculateShipping({
        addressId: selectedAddressId,
        truckType,
      })
        .then((res) => {
          setShippingFee(res.shippingFee || 0);
        })
        .catch(() => {
          // Standard estimate if backend calculation requires specific routing
          setShippingFee(500);
        })
        .finally(() => setIsCalculatingShipping(false));
    } else {
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

      const orderPayload = {
        orderType,
        addressId: orderType === OrderType.Delivery ? finalAddressId : null,
        truckType: orderType === OrderType.Delivery ? truckType : null,
        driverName: orderType === OrderType.Pickup ? driverName : null,
        vehiclePlateNumber: orderType === OrderType.Pickup ? vehiclePlateNumber : null,
        driverLicenseNumber: orderType === OrderType.Pickup ? driverLicenseNumber : null,
        expectedPickupDate: orderType === OrderType.Pickup ? expectedPickupDate : null,
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
    newAddress,
    setNewAddress,
    truckType,
    setTruckType,
    shippingFee,
    isCalculatingShipping,
    driverName,
    setDriverName,
    vehiclePlateNumber,
    setVehiclePlateNumber,
    driverLicenseNumber,
    setDriverLicenseNumber,
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
