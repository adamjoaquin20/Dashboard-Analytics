import React from 'react';
import Header from "./components/Header";
import KPIGrid from "./components/KPIGrid";
import MapChart from "./components/MapChart"; 
// Menghapus import backGround karena tidak digunakan
// import backGround from './assets/b.png'; 

function App() {
  return (
    // Container utama: flex-col, h-screen, dan overflow-hidden (Satu Halaman Penuh, Tanpa Scroll)
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* 1. Header (Bg paling gelap) */}
      <div className="shrink-0 bg-[#2C3C58] shadow-md dark:bg-slate-900">
        <Header />
      </div>
      
      {/* 2. KPI Grid (Bg medium gelap) */}
      <div 
        className="px-6 py-4 shrink-0 bg-[#354865] dark:bg-slate-800"
      > 
        <KPIGrid />
      </div>

      {/* 3. BLOK KONTEN UTAMA (Area Peta, Area Visualisasi Kanan, dan Footer) */}
      <div
        // Menggunakan Grid 2x2: Map dan Panel 1fr, Footer auto
        className="flex-grow grid grid-rows-[1fr_auto] grid-cols-2 bg-[#2C3C58] dark:bg-slate-900 overflow-hidden" 
      >
        
        {/* Kiri Bawah → Map Besar (Row 1, Kolom 1) - Mengisi Setengah Kiri */}
        <div className="row-start-1 col-start-1 p-6 flex items-center justify-center">
          <div
            className="w-[95%] h-[95%] border border-gray-400 rounded-md shadow-lg p-1 
                       bg-white transition-all duration-300 overflow-hidden" 
          >
            {/* MapChart mengisi 100% tinggi container */}
            <MapChart height="100%" /> 
          </div>
        </div>

        {/* Kanan Bawah → Area Kosong / Visualisasi (Row 1, Kolom 2) - Mengisi Setengah Kanan */}
        <div className="row-start-1 col-start-2 p-6 flex items-center justify-center">
          <div className="flex-1 h-[95%] border border-gray-400 rounded-md shadow-lg p-4 bg-white dark:bg-slate-700/50">
            
            <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-gray-200">Visualisasi Data Transformasi Sosial & Ekonomi Digital</h3>
            
            <p className="text-gray-500">grafik korelasi ntaran aje.</p>
          </div>
        </div>

        {/* Kiri Paling Bawah → Footer (@dataslayer.tup) (Row 2, Kolom 1) */}
        <div className="row-start-2 col-start-1 p-6 pt-0 text-gray-400 text-sm dark:text-gray-500">
          © dataslayer.tup
        </div>

        {/* Kosongkan Area Footer Kanan (Row 2, Kolom 2) */}
        <div className="row-start-2 col-start-2">
          {/* Dibiarkan kosong */}
        </div>

      </div>
    </div>
  );
}

export default App;