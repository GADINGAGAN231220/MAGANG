import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Users, Settings, Plus, Save, Trash2, Edit, User, Mail, 
  Briefcase as BriefcaseIcon, Factory, Phone, Loader, LogOut, X, Lock 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// --- KUNCI LOCAL STORAGE (HARUS SAMA) ---
const USERS_STORAGE_KEY = "app_users";

// --- TIPE DATA PENGGUNA (TAMBAH 'password') ---
type UserData = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user';
  position: string; 
  department: string;
  phoneNumber: string;
  password: string; // KOLOM BARU UNTUK LOGIN
};

// --- KOMPONEN INPUT STYLISH ---
const DynamicInput = ({ label, value, onChange, icon: Icon, placeholder, required = true, type = 'text' }) => (
  <div className="space-y-1">
    <label className="flex items-center text-sm font-semibold text-gray-700">
      <Icon className="w-4 h-4 mr-2 text-green-600" />
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm transition duration-150"
      required={required}
    />
  </div>
);

// --- KOMPONEN UTAMA DASHBOARD ADMIN ---

function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Users Management');
  const [isLoading, setIsLoading] = useState(true);

  // State untuk form Tambah/Edit
  // Default password diatur agar tidak hilang saat edit
  const defaultFormData: Omit<UserData, 'id'> = useMemo(() => ({
    username: '',
    fullName: '',
    email: '',
    role: 'user',
    position: '', 
    department: '',
    phoneNumber: '',
    password: '', // default
  }), []);
  
  const [formData, setFormData] = useState<Omit<UserData, 'id'>>(defaultFormData);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // --- Load Data ---
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      setUsers([]); // Reset jika ada error parsing
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Save Data ---
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (error) {
        console.error("Error saving users to localStorage:", error);
      }
    }
  }, [users, isLoading]);

  // --- FUNGSI MANAJEMEN USER ---

  const handleOpenModal = (userToEdit?: UserData) => {
    if (userToEdit) {
      setIsEditing(userToEdit.id);
      // Saat mengedit, ambil semua data, tapi kosongkan password untuk diisi ulang
      setFormData({ ...userToEdit, password: '' }); 
    } else {
      setIsEditing(null);
      setFormData(defaultFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(null);
    setFormData(defaultFormData);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana (pastikan semua field wajib terisi)
    if (!formData.username || !formData.fullName || !formData.position || !formData.department || !formData.phoneNumber || (!isEditing && !formData.password)) {
      console.error("Harap isi semua kolom wajib (*).");
      // Ganti dengan logika modal yang lebih baik daripada alert()
      return;
    }

    if (isEditing) {
      // Edit User
      // Cari data user lama
      const existingUser = users.find(u => u.id === isEditing);

      // Gunakan password baru jika diisi, atau password lama jika tidak diisi
      const finalPassword = formData.password || existingUser?.password || '';

      setUsers(users.map(u => 
        u.id === isEditing ? { ...formData, id: isEditing, password: finalPassword } as UserData : u
      ));
    } else {
      // Tambah User Baru
      const newUser: UserData = { ...formData, id: uuidv4() };
      setUsers([...users, newUser]);
    }
    handleCloseModal();
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // --- RENDER CONTENT (Manajemen Pengguna) ---

  const renderUserManagement = () => (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Pengguna ({users.length})</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700 transition-colors transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Pengguna
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40"><Loader className="w-8 h-8 animate-spin text-green-600" /></div>
      ) : users.length === 0 ? (
        <div className="p-10 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-lg font-medium text-gray-700">Tidak ada pengguna. Mari buat satu!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Nama Lengkap', 'Jabatan', 'Departemen', 'Role', 'Aksi'].map(header => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-green-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <button 
                      onClick={() => handleOpenModal(user)} 
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition"
                      title="Edit Pengguna"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Users Management", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  // --- MAIN LAYOUT ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar Admin */}
      <aside className="w-64 bg-green-900 text-white flex flex-col p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-10 mt-2">
          <Factory className="w-8 h-8 text-green-300" />
          <span className="font-extrabold text-2xl tracking-wider">ADMIN</span>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveMenu(name)}
              className={`flex items-center w-full py-3 px-4 rounded-xl text-left transition-all duration-200 font-medium
                ${
                  activeMenu === name
                    ? "bg-green-700 text-white shadow-lg border-l-4 border-white"
                    : "hover:bg-green-800 text-green-100"
                }`}
            >
              <Icon className="w-5 h-5 mr-4" />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-green-800">
          <button className="flex items-center w-full py-3 px-4 rounded-xl text-left font-medium text-red-300 hover:bg-green-800 transition-colors">
            <LogOut className="w-5 h-5 mr-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-200 pb-3">
          {activeMenu}
        </h1>
        {activeMenu === 'Users Management' ? renderUserManagement() : (
          <div className="p-10 bg-white rounded-xl shadow-md text-center">
            <p className="text-xl font-medium text-green-700">Selamat datang di Panel Admin.</p>
            <p className="text-gray-500 mt-2">Pilih **Users Management** di menu samping untuk mengelola data pengguna.</p>
          </div>
        )}
      </main>

      {/* Modal Tambah/Edit Pengguna */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 max-h-[95vh] overflow-y-auto transform scale-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-2xl font-bold text-green-800">
                {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Baris 1: Username & Nama Lengkap */}
                <DynamicInput label="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} icon={User} placeholder="misalnya: budi_dharma" />
                <DynamicInput label="Nama Lengkap" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} icon={User} placeholder="misalnya: Budi Dharmawan" />
                
                {/* Baris 2: Password & Role */}
                {/* Password hanya wajib diisi saat mode TAMBAH BARU */}
                <DynamicInput 
                    label={`Password ${isEditing ? '(Kosongkan jika tidak diubah)' : ''}`} 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    icon={Lock} 
                    placeholder={isEditing ? 'Masukkan password baru' : 'Wajib diisi'} 
                    required={!isEditing}
                    type="password"
                />

                <div className="space-y-1">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                        <User className="w-4 h-4 mr-2 text-green-600" />
                        Role Pengguna <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150"
                    >
                        <option value="user">User Biasa</option>
                        <option value="admin">Admin (Akses Admin Panel)</option>
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                {/* Baris 3: Posisi & Departemen */}
                <DynamicInput label="Jabatan (Position)" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} icon={BriefcaseIcon} placeholder="misalnya: Manager Proyek" />
                <DynamicInput label="Departemen" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} icon={Factory} placeholder="misalnya: IT / Keuangan" />
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Baris 4: Email & Telepon */}
                <DynamicInput label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={Mail} placeholder="email@perusahaan.com" required={false} />
                <DynamicInput label="Nomor Telepon" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} icon={Phone} placeholder="misalnya: 0812..." type="tel" />
              </div>

              {/* Tombol Aksi */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-green-700 transition-colors transform hover:scale-[1.01]"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
