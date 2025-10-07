// src/utils/withAuth.tsx

import React, { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

// Definisikan tipe untuk props HOC
interface WithAuthOptions {
  allowedRole?: 'user' | 'admin' | string;
  redirectTo?: string;
}

// HOC untuk memproteksi komponen
const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { redirectTo = '/auth/login', allowedRole } = options;

  const ComponentWithAuth: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // 1. Tunggu sampai loading selesai
      if (loading) return; 

      // 2. Jika user TIDAK ADA (belum login), redirect ke halaman login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // 3. Jika ada role spesifik dan role user tidak sesuai, redirect ke dashboard
      if (allowedRole && user.role !== allowedRole) {
        // Ganti dengan path ke dashboard yang sesuai
        router.push('/dashboard-unauthorized'); 
        return;
      }
      
    }, [user, loading, router, allowedRole, redirectTo]);

    // Tampilkan pesan loading selama proses autentikasi
    if (loading || !user) {
      return <div className="min-h-screen flex items-center justify-center text-lg">Memverifikasi akses...</div>;
    }

    // Tampilkan komponen asli jika sudah login dan role sesuai
    return <WrappedComponent {...props} />;
  };

  // Berikan nama display yang lebih baik untuk debugging
  ComponentWithAuth.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return ComponentWithAuth;
};

// Fungsi pembantu untuk nama display
function getDisplayName<P>(WrappedComponent: ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;