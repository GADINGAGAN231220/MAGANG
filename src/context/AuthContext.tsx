// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';

// 1. Tentukan Interface (Tipe Data) untuk User
interface UserData {
  token: string;
  name: string;
  id: string;
  role: 'user' | 'admin' | string; // Memperjelas tipe role
  jabatan: string;
  departemen: string;
  telp: string;
  email: string;
}

// 2. Tentukan Interface untuk Context Value
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  // Fungsi login hanya memerlukan username. Token/placeholder akan dibuat di dalam
  login: (username: string) => void; 
  logout: () => void;
}

// 3. Buat Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props untuk AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// 4. Buat Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper untuk menentukan data user berdasarkan username (SIMULASI)
  const getUserData = (username: string, token: string): UserData => {
      // 💡 LOGIKA UNTUK ROLE ADMIN
      if (username === 'admin') {
          return {
              token: token,
              name: "Administrator Utama",
              id: "00001",
              role: "admin",
              jabatan: "Pimpinan Proyek",
              departemen: "Manajemen",
              telp: "+62 800-0000-0000",
              email: "admin@toolbox.com",
          };
      }
      // 💡 LOGIKA UNTUK ROLE USER
      if (username === 'user_a') {
          return {
              token: token,
              name: "Si A",
              id: "12345",
              role: "user",
              jabatan: "Spesialis Proyek",
              departemen: "IT Solutions",
              telp: "+62 811-2345-6789",
              email: "si.a@toolbox.com",
          };
      }
      
      // Default User
      return { 
          token: token,
          name: "Pengguna Umum", 
          id: "00000", 
          role: "user",
          jabatan: "Staff",
          departemen: "Umum",
          telp: "N/A",
          email: `${username}@toolbox.com` 
      };
  }

  // --- LOGIKA PEMUATAN DATA USER DARI LOCAL STORAGE ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedUser) {
        try {
          const loggedInUser = JSON.parse(storedUser);
          
          if (loggedInUser && loggedInUser.username) {
            // Mengambil token atau menggunakan placeholder jika tidak ada
            const token = loggedInUser.token || 'temp_token'; 
            
            // Mengisi data user dengan fungsi helper
            const userData = getUserData(loggedInUser.username, token);
            setUser(userData);
          } else {
            // Jika data user tersimpan tapi korup, hapus dan set null
             localStorage.removeItem('currentUser');
             setUser(null);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem('currentUser');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []); // HANYA BERJALAN SEKALI SAAT KOMPONEN DIMUAT PERTAMA KALI
  
  // Fungsi dipanggil saat user berhasil login
  const login = (username: string) => {
    // 💡 Kita tidak lagi melakukan window.location.reload() di sini.
    // Kita biarkan logika Next.js dan HOC withAuth yang menangani redirect setelah state berubah.
    const tokenPlaceholder = 'valid_token_' + new Date().getTime(); // Placeholder token
    localStorage.setItem('currentUser', JSON.stringify({ username, token: tokenPlaceholder })); 
    
    // Set user state secara langsung agar WithAuth bereaksi
    const userData = getUserData(username, tokenPlaceholder);
    setUser(userData);

    // Kita arahkan pengguna ke dashboard yang sesuai, menghilangkan ketergantungan reload()
    if (userData.role === 'admin') {
      router.push('/admin/dashboard'); 
    } else {
      router.push('/user/dashboard'); 
    }
  };

  // Fungsi dipanggil saat user logout
  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {/* Jika loading true (hanya sesaat di awal) */}
      {loading ? <div className="p-10 text-center text-gray-700">Memuat data pengguna...</div> : children}
    </AuthContext.Provider>
  );
};

// 5. Custom hook useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Check your _app.tsx file.');
  }
  return context;
};