// // src/components/UserProfileContent.tsx

// import React, { useContext } from 'react';
// import { AuthContext } from '@/context/AuthContext'; // Asumsi ini adalah Context Anda

// // --- Komponen Pembantu (Dipindahkan dari user propil) ---

// const Card = ({ status, count, color }) => (
//   <div className={`p-4 rounded-lg shadow-sm ${color}`}>
//     <div className={`w-3 h-3 rounded-full mr-2 inline-block ${color.split(' ')[0].replace('text', 'bg')}`}></div>
//     <span className="font-semibold text-sm">{status}</span>
//     <p className="text-xl font-bold mt-1">{count}</p>
//   </div>
// );

// const Calendar = () => {
//   const now = new Date();
//   const currentMonth = now.getMonth();
//   const currentYear = now.getFullYear();
//   const todayDate = now.getDate();
//   const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(now);
//   const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
//   const dayHeaders = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
//   let calendarCells = [];

//   for (let i = 0; i < firstDayOfMonth; i++) {
//     calendarCells.push(null);
//   }

//   for (let date = 1; date <= daysInMonth; date++) {
//     calendarCells.push(date);
//   }

//   return (
//     <div className="p-4 border border-gray-200 rounded-lg shadow-md max-w-xs select-none">
//       <div className="flex justify-between items-center mb-3 text-sm font-semibold text-gray-800">
//         <span>{formattedMonthName}</span>
//         <span>{currentYear}</span>
//       </div>

//       <div className="grid grid-cols-7 gap-1 text-center text-xs">
//         {dayHeaders.map((day, index) => (
//           <span key={index} className="text-gray-500 font-bold py-1">
//             {day}
//           </span>
//         ))}

//         {calendarCells.map((date, index) => {
//           const isToday = date === todayDate && currentMonth === now.getMonth() && currentYear === now.getFullYear();

//           let dateClass = 'py-1 rounded-md transition-colors duration-200';

//           if (date) {
//             dateClass += ' text-gray-700 hover:bg-green-100 cursor-pointer';
//           } else {
//             dateClass += ' text-transparent pointer-events-none';
//           }

//           if (isToday) {
//             dateClass = 'py-1 rounded-md bg-green-700 text-white font-bold shadow-md cursor-default';
//           }

//           return (
//             <span
//               key={index}
//               className={dateClass}
//             >
//               {date || ''}
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // --- Komponen Utama Profil ---

// export default function UserProfileContent() {
//   // Ambil data user dan logout dari Context
//   const { user, logout } = useContext(AuthContext);

//   const userData = user || {
//     name: "Pengguna Tidak Dikenal",
//     id: "00000",
//     jabatan: "N/A",
//     departemen: "N/A",
//     telp: "N/A",
//     email: "N/A",
//   };

//   return (
//     <div className="p-4 sm:p-8 bg-gray-100/50 rounded-xl min-h-full">
//       {/* Header Profil (Hijau) */}
//       <div className="bg-green-700 p-6 sm:p-10 rounded-xl shadow-lg mb-8">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

//           {/* Ikon Profil */}
//           <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center text-green-700 text-3xl font-bold border-4 border-green-300">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-5 5h10a5 5 0 00-5-5z" clipRule="evenodd" />
//             </svg>
//           </div>

//           {/* Nama dan ID */}
//           <div className="flex-grow text-white">
//             <h1 className="text-3xl font-bold mb-1">{userData.name}</h1>
//             <p className="text-sm text-green-200 mb-4">{userData.id}!</p>
//           </div>

//           {/* Detail Kontak/Jabatan */}
//           <div className="bg-green-600 p-4 rounded-lg shadow-inner w-full sm:w-auto sm:min-w-[250px] text-white">
//             <p className="text-sm">
//               <span className="font-semibold">Jabatan:</span> {userData.jabatan}
//             </p>
//             <p className="text-sm">
//               <span className="font-semibold">Departemen:</span> {userData.departemen}
//             </p>
//             <p className="text-sm">
//               <span className="font-semibold">No.Telp:</span> {userData.telp}
//             </p>
//             <p className="text-sm">
//               <span className="font-semibold">Email:</span> {userData.email}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Konten Utama Profil (Putih) */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Aktivitas & Ringkasan Pekerjaan</h2>

//         {/* Total Jobs Summary */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <Card status="Open" count={5} color="text-orange-600 bg-orange-100" />
//           <Card status="Progress" count={12} color="text-blue-600 bg-blue-100" />
//           <Card status="Review" count={3} color="text-purple-600 bg-purple-100" />
//           <Card status="Success" count={25} color="text-green-600 bg-green-100" />
//         </div>

//         {/* Kalender */}
//         <div className="flex justify-end">
//           <Calendar />
//         </div>

//         {/* Pengaturan Akun dan Logout */}
//         <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
//           <h3 className="text-xl font-semibold text-gray-800">Pengaturan Akun</h3>
//           <button
//             onClick={logout}
//             className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }