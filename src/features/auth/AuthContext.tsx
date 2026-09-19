import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from './authService';
import { notificationService } from '../notifications/notificationService';
import { requestRefreshToken } from '../../infrastructure/api/apiClient';
import type { User, LoginDto, RegisterDto } from './types';
import { toast } from 'sonner';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (credentials: LoginDto) => Promise<boolean>;
  sendLoginOtp: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyLoginOtp: (data: { phoneNumber: string; code: string }) => Promise<boolean>;
  register: (data: RegisterDto) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(() => !!authService.getUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      const hadUser = !!authService.getUser();
      authService.setUser(null);
      setUser(null);
      if (hadUser) {
        toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
        setIsAuthModalOpen(true);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    // If not signed in locally, user is a guest; do not trigger unauthorized API calls
    const cached = authService.getUser();
    if (!cached) {
      setIsLoading(false);
      return;
    }

    authService.getMe()
      .then((u) => setUser(u))
      .catch(() => {
        setUser(null);
        authService.setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Proactive Silent Session Refresh:
  // AccessToken expires every 15 minutes. We silently refresh every 10 minutes (and on tab return)
  // so an active user never experiences a session expiration or interruption.
  useEffect(() => {
    if (!user) return;

    let lastRefreshTime = Date.now();

    const doSilentRefresh = async () => {
      try {
        const refreshed = await requestRefreshToken();
        if (refreshed) {
          lastRefreshTime = Date.now();
        }
      } catch {
        // Handled internally by requestRefreshToken fallback
      }
    };

    // Refresh every 10 minutes (600,000 ms)
    const interval = setInterval(doSilentRefresh, 10 * 60 * 1000);

    // Also refresh on window focus / tab visibility if 10+ minutes elapsed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastRefreshTime;
        if (elapsed > 10 * 60 * 1000) {
          doSilentRefresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [user]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const login = useCallback(async (credentials: LoginDto) => {
    try {
      const res = await authService.login(credentials);
      if (res.user) {
        setUser(res.user);
      } else {
        const me = await authService.getMe();
        setUser(me);
      }
      toast.success('تم تسجيل الدخول بنجاح');
      closeAuthModal();
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل تسجيل الدخول، تحقق من البيانات');
      return false;
    }
  }, [closeAuthModal]);

  const sendLoginOtp = useCallback(async (phoneNumber: string) => {
    try {
      const res = await authService.sendLoginOtp(phoneNumber);
      toast.success(res?.message || 'تم إرسال رمز التحقق بنجاح إلى هاتفك');
      return { success: true, message: res?.message || '' };
    } catch (err: any) {
      toast.error(err?.message || 'فشل إرسال رمز التحقق، تأكد من صحة الرقم');
      throw err;
    }
  }, []);

  const verifyLoginOtp = useCallback(async (data: { phoneNumber: string; code: string }) => {
    try {
      const res = await authService.verifyLoginOtp(data);
      if (res?.user) {
        setUser(res.user);
      } else {
        const me = await authService.getMe();
        setUser(me);
      }
      toast.success('تم تسجيل الدخول بنجاح');
      closeAuthModal();
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
      return false;
    }
  }, [closeAuthModal]);

  const register = useCallback(async (data: RegisterDto) => {
    try {
      const res = await authService.register(data);
      if (res.user) {
        setUser(res.user);
      } else {
        const me = await authService.getMe();
        setUser(me);
      }
      toast.success('تم إنشاء الحساب بنجاح');
      closeAuthModal();
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'فشل إنشاء الحساب');
      return false;
    }
  }, [closeAuthModal]);

  const logout = useCallback(async () => {
    try {
      const storedToken = sessionStorage.getItem('fcm_web_token');
      if (storedToken) {
        await notificationService.removeDeviceToken({ fcmToken: storedToken }).catch(() => null);
        sessionStorage.removeItem('fcm_web_token');
      }
    } catch {
      // Ignore cleanup error
    }
    await authService.logout();
    setUser(null);
    toast.info('تم تسجيل الخروج');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !isLoading && !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        sendLoginOtp,
        verifyLoginOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
