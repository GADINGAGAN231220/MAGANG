import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

// Definisikan props untuk komponen layout
interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout Komponen untuk semua Halaman Admin.
 * Memisahkan Sidebar dan konten utama.
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Komponen Sidebar Terpisah */}
      <Sidebar />
      
      {/* 2. Area Konten Utama (Dashboard, Pengguna, dll.) */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Opsional: Tambahkan Header/Navbar di sini jika diperlukan */}
        
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}