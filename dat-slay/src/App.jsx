import React, { useState } from 'react'; 
import Header from "./components/Header";
import KPIGrid from "./components/KPIGrid";
import MapChart from "./components/MapChart"; 
import WatermarkDAC from './assets/b.png'; 

// --- DATA STRUKTUR LENGKAP IPM NASIONAL ---
const fullIPMData = {
    "2020": {value: "71.94", change: "N/A", trend: "N/A"},
    "2021": {value: "72.29", change: "0.49%", trend: "up"},
    "2022": {value: "72.91", change: "0.86%", trend: "up"},
    "2023": {value: "73.55", change: "0.88%", trend: "up"},
    "2024": {value: "74.20", change: "0.88%", trend: "up"},
    "5Y": {value: "72.98", change: "3.14%", trend: "up"}
};
// ------------------------------------------

function App() {
    const [selectedIPMOption, setSelectedIPMOption] = useState('5Y');

    return (
        <div className="relative flex flex-col h-screen overflow-hidden bg-[#2C3C58]"> 
            
            {/* 0. WATERMARK DAC (LAYER PALING ATAS - Z-INDEX 100) */}
            <div 
                className="absolute inset-0 z-[100] pointer-events-none" 
                style={{
                    backgroundImage: `url(${WatermarkDAC})`,
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.15,
                }}
            />

            {/* ======================================================= */}
            {/* KONTEN WRAPPER: Diperkecil & Dipusatkan, diberi padding */}
            {/* ======================================================= */}
            <div 
                // Mengubah max-w-7xl menjadi max-w-6xl (atau lebih kecil jika perlu)
                // Menambahkan padding p-8 (sekitar 32px) di sekeliling konten
                className="w-full max-w-6xl mx-auto h-full flex flex-col relative z-20 p-8" 
            > 
                
                {/* 1. Header */}
                <div className="shrink-0 shadow-md bg-[#2C3C58] rounded-lg"> {/* Tambah rounded-lg */}
                    <Header />
                </div>
                
                {/* 2. KPI Grid */}
                <div 
                    className="px-6 py-4 shrink-0 bg-[#354865] dark:bg-slate-800 rounded-lg mt-4" // Tambah rounded-lg dan margin top
                > 
                    <KPIGrid 
                        ipmFullData={fullIPMData} 
                        selectedOption={selectedIPMOption} 
                        setIPMOption={setSelectedIPMOption} 
                    /> 
                </div>

                {/* 3. BLOK KONTEN UTAMA (Area Peta, Area Visualisasi Kanan, dan Footer) */}
                <div
                    className="flex-grow grid grid-rows-[1fr_auto] grid-cols-2 overflow-hidden
                               bg-gradient-to-b from-[#2C3C58] to-[#1D2A40] dark:bg-slate-900 rounded-lg mt-4" // Tambah rounded-lg dan margin top
                >
                    
                    {/* Kiri Bawah → Map Besar */}
                    <div className="row-start-1 col-start-1 p-6 flex items-center justify-center">
                        <div
                            className="w-[95%] h-[95%] border border-gray-400 rounded-md shadow-lg p-1 
                                       bg-white transition-all duration-300 overflow-hidden" 
                        >
                            <MapChart height="100%" /> 
                        </div>
                    </div>

                    {/* Kanan Bawah → Area Kosong / Visualisasi */}
                    <div className="row-start-1 col-start-2 p-6 flex items-center justify-center">
                        <div className="flex-1 h-[95%] border border-gray-400 rounded-md shadow-lg p-4 bg-white dark:bg-slate-700/50">
                            <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-gray-200">Visualisasi Data Transformasi Sosial & Ekonomi Digital</h3>
                            <p className="text-gray-500">Area ini dialokasikan untuk grafik korelasi, tabel detail, atau visualisasi lainnya.</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="row-start-2 col-span-2 p-6 pt-0 text-gray-400 text-sm dark:text-gray-500 text-center">
                        © dataslayer.tup
                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;