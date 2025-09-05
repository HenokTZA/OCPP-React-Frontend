// src/components/AppWrapper.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { SidebarProvider } from '@/lib/sidebarContext';
import SplashScreen from '@/pages/SplashScreen';

export default function AppWrapper({ children }) {
  const { isAuth, loading, user } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) setSplashComplete(true);
  }, [loading]);

  useEffect(() => {
    if (showSplash || loading || !splashComplete) return;

    const allowedAuthRoots = [
      '/', '/app', '/admin', '/dashboard', '/reports',
      '/diagnose', '/cp/', '/manage', '/history' // 👈 add /manage here
    ];
    const isOnAllowedAuthPath = allowedAuthRoots.some(p =>
      location.pathname === p || location.pathname.startsWith(p)
    );

    if (isAuth) {
      // stay put on any allowed/authenticated route
      if (isOnAllowedAuthPath) return;

      // otherwise, role-based landing
      if (user?.role === 'user')        navigate('/app', { replace: true });
      else if (user?.role === 'super_admin') navigate('/', { replace: true });
      else                               navigate('/home', { replace: true });
    } else {
      const authPages = ['/login', '/signup', '/forgot-password', '/create-password', '/reset-password'];
      const isOnAuthPage = authPages.some(page => location.pathname.startsWith(page));
      if (!isOnAuthPage && location.pathname !== '/home' && location.pathname !== '/splash') {
        navigate('/home', { replace: true });
      }
    }
  }, [showSplash, loading, splashComplete, isAuth, user?.role, location.pathname, navigate]);

  if (showSplash || loading) return <SplashScreen />;
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}

