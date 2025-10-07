import { useState, useMemo, useCallback } from 'react';

// --- Tipe Data ---
type Notes = {
  [key: string]: string; // Format key: 'YYYY-MM-DD', value: 'Catatan'
}

// --- Fungsi Bantuan ---

const getDayNames = () => ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Mendapatkan detail hari untuk bulan tertentu
const getMonthDetails = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();

  // Hari pertama dalam seminggu (0 = Minggu, 1 = Senin, dst)
  const startingDay = firstDay.getDay();

  // Array untuk menampung semua tanggal
  const days: (number | null)[] = [];

  // Isi dengan placeholder null untuk hari sebelum tanggal 1
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  // Isi dengan tanggal 1 sampai akhir bulan
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  return days;
};

// --- Komponen Utama ---
export default function CalendarCard() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today); // Untuk navigasi bulan
  const [selectedDate, setSelectedDate] = useState(today); // Tanggal yang diklik
  const [notes, setNotes] = useState<Notes>({
    // Contoh catatan awal (untuk tanggal hari ini)
    [`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`]: "Meeting Tim 10:00",
  });
  const [noteInput, setNoteInput] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Dapatkan detail hari di bulan yang aktif (di-memo agar efisien)
  const monthDays = useMemo(() => getMonthDetails(year, month), [year, month]);

  // Format tanggal yang dipilih untuk kunci catatan: YYYY-MM-DD
  const selectedDateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
  
  // Dapatkan nama bulan dan tahun untuk header
  const monthYearDisplay = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
  
  // Dapatkan nama hari untuk tampilan catatan
  const selectedDayDisplay = selectedDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Handler untuk navigasi bulan (maju/mundur)
  const handleMonthChange = (offset: number) => {
    setCurrentDate(prevDate => {
      // Mengatur tanggal ke hari pertama bulan baru
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + offset, 1);
      return newDate;
    });
  };

  // Handler saat tanggal di kalender diklik
  const handleDateClick = useCallback((day: number) => {
    const newSelectedDate = new Date(year, month, day);
    setSelectedDate(newSelectedDate);
    
    // Muat catatan yang sudah ada untuk tanggal ini
    const key = `${newSelectedDate.getFullYear()}-${newSelectedDate.getMonth() + 1}-${newSelectedDate.getDate()}`;
    setNoteInput(notes[key] || '');
  }, [year, month, notes]);

  // Handler untuk menyimpan catatan
  const handleSaveNote = () => {
    const trimmedNote = noteInput.trim();
    if (trimmedNote) {
        setNotes(prevNotes => ({
            ...prevNotes,
            [selectedDateKey]: trimmedNote,
        }));
        // Menggunakan modal/div custom karena alert() tidak diizinkan di iframe
        console.log(`Catatan pada ${selectedDayDisplay} berhasil disimpan: ${trimmedNote}`); 
        // Anda bisa menambahkan notifikasi UI di sini
    } else {
        // Jika input kosong, hapus catatan jika ada
        setNotes(prevNotes => {
            const newNotes = { ...prevNotes };
            delete newNotes[selectedDateKey];
            return newNotes;
        });
        setNoteInput('');
        console.log(`Catatan pada ${selectedDayDisplay} telah dihapus.`);
    }
  };

  // --- Fungsi Penentu Kelas Styling ---
  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  const isSelected = (day: number | null) => {
    if (day === null) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };
  
  const hasNote = (day: number | null) => {
    if (day === null) return false;
    const key = `${year}-${month + 1}-${day}`;
    // Periksa apakah ada catatan non-kosong
    return !!notes[key] && notes[key].trim().length > 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-full">
      <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Kalender & Catatan Harian</h3>
      
      <div className="flex flex-col xl:flex-row gap-6 h-full">
        {/* 1. Bagian Kalender */}
        <div className="w-full xl:w-1/2 flex flex-col">
          {/* Header Kalender */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => handleMonthChange(-1)} 
              className="p-2 text-green-700 hover:bg-green-100 rounded-full transition-all"
              aria-label="Bulan Sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h4 className="text-xl font-bold text-gray-800 capitalize">
              {monthYearDisplay}
            </h4>
            <button 
              onClick={() => handleMonthChange(1)} 
              className="p-2 text-green-700 hover:bg-green-100 rounded-full transition-all"
              aria-label="Bulan Selanjutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Grid Kalender */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm flex-grow">
            {/* Nama Hari */}
            {getDayNames().map(day => (
              <div key={day} className="font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Tanggal */}
            {monthDays.map((day, index) => (
              <div key={index} className="aspect-square flex items-center justify-center">
                {day !== null && (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 relative text-base
                      ${isToday(day) ? 'bg-red-600 text-white font-bold shadow-md' : ''}
                      ${isSelected(day) && !isToday(day) ? 'bg-green-700 text-white font-bold shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                      ${hasNote(day) && !isSelected(day) && !isToday(day) ? 'border-2 border-yellow-500 text-gray-900 font-medium' : ''}
                      ${hasNote(day) && !isSelected(day) && !isToday(day) ? 'after:content-["•"] after:absolute after:bottom-1 after:text-yellow-600' : ''}
                    `}
                    title={hasNote(day) ? 'Ada Catatan' : undefined}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 2. Bagian Catatan */}
        <div className="w-full xl:w-1/2 p-4 pt-6 border-t xl:border-t-0 xl:border-l border-gray-200 flex flex-col">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            Catatan untuk: <span className="text-green-700">{selectedDayDisplay}</span>
          </h4>
          
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none h-40 xl:h-auto xl:flex-grow text-sm shadow-inner"
            placeholder={`Tulis catatan untuk ${selectedDayDisplay}...`}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />
          
          <button 
            onClick={handleSaveNote}
            className="w-full mt-3 bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md"
          >
            {noteInput.trim() ? "Simpan/Perbarui Catatan" : "Hapus Catatan (Jika Ada)"}
          </button>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-sm">
            <p className="font-medium text-green-800 mb-1">Catatan Tersimpan:</p>
            <p className="text-gray-700 italic">
              {notes[selectedDateKey] && notes[selectedDateKey].trim() ? notes[selectedDateKey] : "Tidak ada catatan untuk tanggal ini."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
