import type { User } from './types';

/**
 * Checks if a user is classified as a Sub-Customer (عميل فرعي / من صغار التجار)
 */
export function isSubCustomer(user: User | null): boolean {
  if (!user) return false;
  if (user.isSubCustomer === true) return true;
  if (user.isMainCustomer === true) return false;
  if (user.isMerchant === true) return false;

  if (typeof user.parentMerchantId === 'string' && user.parentMerchantId.trim() !== '') {
    return true;
  }
  if (typeof user.parentMerchantName === 'string' && user.parentMerchantName.trim() !== '') {
    return true;
  }
  if (user.customerType === 2 || user.customerType === 'Sub' || user.customerType === 'SubCustomer') {
    return true;
  }
  if (user.role) {
    const r = user.role.toLowerCase();
    if (r.includes('sub') || r.includes('small') || r.includes('فرعي')) {
      return true;
    }
  }
  return false;
}

/**
 * Returns structured classification details and display labels for the customer
 */
export function getUserTypeInfo(user: User | null) {
  const isSub = isSubCustomer(user);

  if (isSub) {
    return {
      isSub: true,
      title: 'عميل فرعي',
      subtitle: user?.parentMerchantName ? `تابع للتاجر: ${user.parentMerchantName}` : 'حساب عميل فرعي',
      parentMerchantName: user?.parentMerchantName || null,
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    };
  }

  return {
    isSub: false,
    title: 'تاجر رئيسي معتمد',
    subtitle: user?.sapCustomerId ? `كود SAP: ${user.sapCustomerId}` : 'حساب تاجر رئيسي',
    parentMerchantName: null,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };
}
