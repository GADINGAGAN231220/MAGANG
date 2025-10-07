// src/pages/index.tsx

import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import withAuth from "@/utils/withAuth";
import { useAuth } from '@/context/AuthContext'; // 👈 Tetap Diperlukan

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function UserDashboard() {
  const { user } = useAuth();
  const userName = user ? user.name : 'XXX';

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen bg-green-600 relative flex items-center justify-center`}
    >
      {/* Logo toolbox pojok kiri atas */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Toolbox Logo"
          width={28}
          height={28}
          priority
        />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-semibold">Toolbox</span>
          <span className="text-xs text-gray-200">v1.0.0</span>
        </div>
      </div>

      {/* Konten Dashboard dalam kotak putih */}
      <main className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        {/* Teks Sambutan Otomatis */}
        <h1 className="text-3xl font-bold text-green-700 mb-4">Welcome, {userName}!</h1>
        <p className="text-gray-600 mb-6">
          Selamat datang di dashboard pengguna! 🎉
        </p>

        {/* Tautan ke Dashboard Utama (dashbord.tsx) */}
        <Link
          href="/dashboard" // Ganti path sesuai nama file dashbord Anda
          className="text-sm text-green-600 hover:underline font-bold"
        >
          Go To Main Dashboard
        </Link>
        <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              href="/auth/login"
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </Link>
        </div>
        {/* Hapus tautan ke /user/profile */}
        {/* <p className="mt-4 text-xs text-gray-400">
            Kunjungi <Link href="/user/profile" className="text-blue-500 hover:underline">/user/profile</Link> untuk melihat detail.
        </p> */}
      </main>
    </div>
  );
}

// ✅ proteksi dengan role user
export default withAuth(UserDashboard, { allowedRole: "user" });