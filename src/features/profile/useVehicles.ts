import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from './vehicleService';
import type { UserVehicle, CreateVehicleDto, UpdateVehicleDto } from './types';
import { toast } from 'sonner';

export function useVehicles(isAuthenticated: boolean) {
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadVehicles = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تحميل بيانات المركبات والسائقين');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const addVehicle = async (data: CreateVehicleDto): Promise<boolean> => {
    try {
      const created = await vehicleService.createVehicle(data);
      setVehicles((prev) => {
        if (created.isDefault) {
          return [...prev.map(v => ({ ...v, isDefault: false })), created];
        }
        return [...prev, created];
      });
      toast.success('تمت إضافة بيانات السائق والسيارة بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل إضافة بيانات السيارة');
      return false;
    }
  };

  const editVehicle = async (id: string, data: UpdateVehicleDto): Promise<boolean> => {
    try {
      const updated = await vehicleService.updateVehicle(id, data);
      setVehicles((prev) => prev.map(v => v.id === id ? { ...v, ...updated } : v));
      toast.success('تم تعديل بيانات السائق والسيارة بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل تعديل بيانات السيارة');
      return false;
    }
  };

  const removeVehicle = async (id: string): Promise<boolean> => {
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles((prev) => prev.filter(v => v.id !== id));
      toast.success('تم حذف السيارة بنجاح');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل حذف السيارة');
      return false;
    }
  };

  const makeDefault = async (id: string): Promise<boolean> => {
    try {
      await vehicleService.setDefaultVehicle(id);
      setVehicles((prev) => prev.map(v => ({ ...v, isDefault: v.id === id })));
      toast.success('تم تعيين المركبة كافتراضية');
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'تعذر تعيين المركبة كافتراضية');
      return false;
    }
  };

  return {
    vehicles,
    isLoading,
    loadVehicles,
    addVehicle,
    editVehicle,
    removeVehicle,
    makeDefault,
  };
}
