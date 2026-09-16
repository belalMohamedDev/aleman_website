import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService } from './authService';
import { notificationService } from '../notifications/notificationService';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
      setIsAuthModalOpen(true);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    authService.getMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

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
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
