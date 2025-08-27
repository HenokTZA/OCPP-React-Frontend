import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import SplashScreen from '@/pages/SplashScreen';

export default function AppWrapper({ children }) {
  const { isAuth, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  // Handle routing after splash and auth loading
  useEffect(() => {
    if (!showSplash && !loading && splashComplete) {
      
      // If user is authenticated, redirect to appropriate app route
      if (isAuth) {
        // Check if user is already on an app route
        if (location.pathname.startsWith('/app') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
          return;
        }
        if (user.role === "user") {
          navigate('/app');
        } else if (user.role === "super_admin") {
          navigate('/');
        } else {
          navigate('/home');
        }
        
      } else {
        // If not authenticated and not on auth pages, redirect to welcome
        const authPages = ['/login', '/signup', '/forgot-password', '/create-password', '/reset-password'];
        const isOnAuthPage = authPages.some(page => location.pathname.startsWith(page));
        
        if (!isOnAuthPage && location.pathname !== '/home' && location.pathname !== '/splash') {
          navigate('/home');
        }
      }
    }
  }, [showSplash, loading, isAuth, splashComplete, navigate, location.pathname]);

  // Mark splash as complete when auth loading is done
  useEffect(() => {
    if (!loading) {
      setSplashComplete(true);
    }
  }, [loading]);

  // Show splash screen while loading or during initial splash
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  // Render the main app content
  return children;
}
