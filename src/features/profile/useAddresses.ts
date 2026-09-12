import { useState, useEffect, useCallback } from 'react';
import { addressService } from './addressService';
import type { UserAddress, CreateAddressDto, UpdateAddressDto } from './types';
import { toast } from 'sonner';

export function useAddresses(isAuthenticated: boolean) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تحميل العناوين');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const addAddress = async (data: CreateAddressDto): Promise<boolean> => {
    try {
      const created = await addressService.createAddress(data);
      setAddresses((prev) => {
        if (created.isDefault) {
          return [...prev.map(a => ({ ...a, isDefault: false })), created];
        }
        return [...prev, created];
      });
      toast.success('تمت إضافة العنوان بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل إضافة العنوان');
      return false;
    }
  };

  const editAddress = async (id: string, data: UpdateAddressDto): Promise<boolean> => {
    try {
      const updated = await addressService.updateAddress(id, data);
      setAddresses((prev) => prev.map(a => a.id === id ? { ...a, ...updated } : a));
      toast.success('تم تعديل العنوان بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل تعديل العنوان');
      return false;
    }
  };

  const removeAddress = async (id: string): Promise<boolean> => {
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter(a => a.id !== id));
      toast.success('تم حذف العنوان بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل حذف العنوان');
      return false;
    }
  };

  const makeDefault = async (id: string): Promise<boolean> => {
    try {
      await addressService.setDefaultAddress(id);
      setAddresses((prev) => prev.map(a => ({ ...a, isDefault: a.id === id })));
      toast.success('تم تعيين العنوان الافتراضي');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تعيين العنوان الافتراضي');
      return false;
    }
  };

  return {
    addresses,
    isLoading,
    loadAddresses,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
  };
}
