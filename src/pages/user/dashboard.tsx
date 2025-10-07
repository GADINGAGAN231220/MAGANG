import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, Bell, LogOut, Briefcase, Factory, Mail, Phone, MapPin, Calendar, Clock, Loader 
} from 'lucide-react';

// --- KUNCI LOCAL STORAGE (HARUS SAMA) ---
const USERS_STORAGE_KEY = "app_users";

// ------------------------------------------
// --- DEFINISI TIPE (TYPE DEFINITIONS) ---
// ------------------------------------------

// 1. Tipe Data Pengguna
type UserData = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  position: string; 
  department: string;
  phoneNumber: string;
};

// 2. Tipe Halaman
type Page = 'Dashboard' | 'Profile';

// 3. Tipe Props Sub-Komponen (Perbaikan Error TypeScript)
type UserAvatarProps = {
  name: string;
  size?: '10' | '16' | '24';
};

type SidebarItemProps = {
  icon: React.ElementType;
  name: string;
  isActive: boolean;
  onClick: () => void;
};

type StatCardProps = {
  icon: React.ElementType;
  title: string;
  value: string;
  color: 'blue' | 'red' | 'yellow';
};

type ActivityItemProps = {
  icon: React.ElementType;
  text: string;
  time: string;
};

type ProfileDetailProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

// --- Default/Fallback Data (Jika localStorage kosong) ---
const FALLBACK_USER: UserData = {
  id: 'guest',
  username: 'GuestUser',
  fullName: 'Pengguna Tamu',
  email: 'guest@company.com',
  role: 'user',
  position: 'Visitor',
  department: 'External',
  phoneNumber: 'N/A',
};

// --- Helper Functions ---
const getInitials = (name: string): string => {
  if (!name) return 'GU';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  const baseName = name.split(' ')[0]; 
  let greeting;

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return `${greeting}, ${baseName}!`;
};

// ------------------------------------------
// --- SUB KOMPONEN (SUDAH DIBERI TIPE) ---
// ------------------------------------------

// --- KOMPONEN: AVATAR DENGAN INISIAL ---
const UserAvatar = ({ name, size = '10' }: UserAvatarProps) => { // ✅ Tipe ditambahkan
  const initials = getInitials(name);
  return (
    <div 
      className={`w-${size} h-${size} rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-white shadow-lg`}
    >
      {initials}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, name, isActive, onClick }: SidebarItemProps) => ( // ✅ Tipe ditambahkan
  <button
    onClick={onClick}
    className={`flex items-center w-full py-3 px-3 rounded-xl text-left transition-all duration-200 font-medium
      ${
        isActive
          ? "bg-green-700 text-white shadow-lg border-l-4 border-white"
          : "hover:bg-green-800 text-green-100"
      }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{name}</span>
  </button>
);

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => { // ✅ Tipe ditambahkan
  const colorClass = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    red: 'bg-red-500 hover:bg-red-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
  }[color];

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-[1.03] border-l-4 border-${color}-500`}>
      <div className={`p-4 rounded-full text-white ${colorClass} shadow-md`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, text, time }: ActivityItemProps) => ( // ✅ Tipe ditambahkan
  <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <Icon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
    <div className="flex-1">
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
    </div>
  </li>
);

const ProfileDetail = ({ icon: Icon, label, value }: ProfileDetailProps) => ( // ✅ Tipe ditambahkan
    <div className="flex items-start space-x-4">
      <Icon className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
      <div>
          <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
          <p className="text-base font-medium text-gray-800">{value}</p>
      </div>
    </div>
);


// ------------------------------------------
// --- KOMPONEN UTAMA DASHBOARD USER ---
// ------------------------------------------

function UserDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [currentUser, setCurrentUser] = useState<UserData>(FALLBACK_USER);
  const [isLoading, setIsLoading] = useState(true);

  // --- Ambil Data Pengguna dari Local Storage ---
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        // Tipe ditambahkan di sini: UserData[]
        const users: UserData[] = JSON.parse(savedUsers); 
        // Cari user yang rolenya 'user', atau ambil yang pertama jika tidak ada
        const targetUser = users.find(u => u.role === 'user') || users[0];
        if (targetUser) {
          setCurrentUser(targetUser);
        } else {
          setCurrentUser(FALLBACK_USER);
        }
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
      setCurrentUser(FALLBACK_USER); // Kembali ke default jika ada error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- RENDER HALAMAN DASHBOARD UTAMA ---
  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader className="w-8 h-8 animate-spin text-green-700" />
        </div>
      );
    }

    // Komponen ucapan 'Good Morning'
    const greeting = getGreeting(currentUser.fullName);

    return (
      <div className="p-4 md:p-8 space-y-8">
        {/* Box Sapaan (Good Morning) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-green-600 transition-shadow hover:shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            {greeting}
          
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Semoga hari Anda produktif dan menyenangkan.
          </p>
        </div>

        {/* Statistik / Widget Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Calendar} title="Sisa Cuti Tahunan" value="12 Hari" color="blue" />
          <StatCard icon={Clock} title="Jam Kerja Hari Ini" value="8 Jam" color="red" />
          <StatCard icon={Bell} title="Notifikasi Baru" value="3 Item" color="yellow" />
        </div>

        {/* Aktivitas Terakhir */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
          <ul className="space-y-3">
            <ActivityItem icon={Briefcase} text="Mengirim laporan mingguan kepada Manager Proyek." time="10 menit lalu" />
            <ActivityItem icon={Mail} text="Membalas email dari tim Keuangan." time="2 jam lalu" />
          </ul>
        </div>
      </div>
    );
  };

  // --- RENDER HALAMAN PROFIL PENGGUNA ---
  const renderProfileContent = () => {
    const user = currentUser; // Menggunakan data yang sudah dimuat

    return (
      <div className="p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Header Profil (Hijau Tua) */}
          <div className="bg-green-700 text-white p-6 md:p-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <UserAvatar name={user.fullName} size="24" />
            <div>
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-green-200 text-lg flex items-center mt-1">
                <Briefcase className="w-4 h-4 mr-2" />
                {user.position}
              </p>
            </div>
          </div>

          {/* Detail Profil */}
          <div className="p-6 md:p-10 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Informasi Kontak & Jabatan</h2>
            
            <ProfileDetail icon={User} label="Username" value={user.username} />
            <ProfileDetail icon={Factory} label="Departemen" value={user.department} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
              <ProfileDetail icon={Mail} label="Email Kantor" value={user.email || 'Tidak tersedia'} />
              <ProfileDetail icon={Phone} label="Nomor Telepon" value={user.phoneNumber} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 pt-6">Lain-lain</h2>
            <ProfileDetail icon={MapPin} label="Alamat" value="Gedung Utama, Lantai 5, Jakarta" />
            <ProfileDetail icon={Briefcase} label="Role Sistem" value={user.role.toUpperCase()} />

          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER (Layout Utama) ---
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar (Hijau Tua) */}
      <aside className="w-64 bg-green-900 text-white flex flex-col p-4 shadow-2xl">
        {/* Logo/Nama Aplikasi */}
        <div className="text-2xl font-extrabold text-green-300 mb-10 mt-2 border-b border-green-800 pb-4">
          <span className="flex items-center gap-2">
            <Briefcase className="w-6 h-6" /> Portal Karyawan
          </span>
        </div>

        {/* Profil Sidebar */}
        <div className="flex flex-col items-center mb-10">
          <UserAvatar name={currentUser.fullName} size="16" />
          <p className="mt-3 text-lg font-bold text-white">{currentUser.username}</p>
          <p className="text-sm text-green-300">{currentUser.position || 'Loading...'}</p>
        </div>

        {/* Navigasi */}
        <nav className="flex-grow space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            name="Dashboard" 
            isActive={currentPage === 'Dashboard'} 
            onClick={() => setCurrentPage('Dashboard')} 
          />
          <SidebarItem 
            icon={User} 
            name="Profil Saya" 
            isActive={currentPage === 'Profile'} 
            onClick={() => setCurrentPage('Profile')} 
          />
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-green-800">
          <button className="flex items-center w-full py-3 px-3 rounded-xl text-left font-medium text-red-300 hover:bg-green-800 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area (Putih) */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Putih */}
        <header className="bg-white shadow-md p-4 md:px-8 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">{currentPage}</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-green-600 transition duration-150 rounded-full bg-gray-100 hover:bg-green-50">
              <Bell className="w-6 h-6" />
            </button>
            <div className="text-gray-600">
              {currentUser.fullName}
            </div>
          </div>
        </header>

        {/* Konten Halaman */}
        <div className="pb-10">
          {currentPage === 'Dashboard' ? renderDashboardContent() : renderProfileContent()}
        </div>
      </main>

    </div>
  );
}

export default UserDashboard;