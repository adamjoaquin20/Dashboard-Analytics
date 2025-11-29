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

const fullPDRBData = {
    "2020": {"value": "Rp.62,068,676", "change": "N/A", "trend": "N/A"},
    "2021": {"value": "Rp.67,053,176", "change": "8.03%", "trend": "up"},
    "2022": {"value": "Rp.76,817,118", "change": "14.56%", "trend": "up"},
    "2023": {"value": "Rp.79,566,500", "change": "3.58%", "trend": "up"}, 
    "2024": {"value": "Rp.84,343,737", "change": "6.00%", "trend": "up"}, 
    "5Y": {"value": "Rp.73,969,821", "change": "35.89%", "trend": "up"} 
};

const fullRLSData = {
    "2020": {"value": "9.43 Tahun", "change": "N/A", "trend": "N/A"},
    "2021": {"value": "9.48 Tahun", "change": "+0.05 Tahun", "trend": "up"},
    "2022": {"value": "9.56 Tahun", "change": "+0.08 Tahun", "trend": "up"},
    "2023": {"value": "9.63 Tahun", "change": "+0.07 Tahun", "trend": "up"},
    "2024": {"value": "9.71 Tahun", "change": "+0.08 Tahun", "trend": "up"},
    "5Y": {"value": "9.56 Tahun", "change": "+0.28 Tahun", "trend": "up"}
};

const fullInternetData = {
    "2020": {'value': '78.18%', 'change': 'N/A', 'trend': 'N/A'},
    "2021": {'value': '82.07%', 'change': '+3.89 pp', 'trend': 'up'},
    "2022": {'value': '86.54%', 'change': '+4.47 pp', 'trend': 'up'},
    "2023": {'value': '87.09%', 'change': '+0.55 pp', 'trend': 'up'},
    "2024": {'value': '89.76%', 'change': '+2.67 pp', 'trend': 'up'},
    '5Y': {'value': '84.73%', 'change': '+11.58 pp', 'trend': 'up'}
};
// ------------------------------------------

function App() {
    // State terpisah untuk setiap KPI agar independen
    const [selectedIPMOption, setSelectedIPMOption] = useState('5Y');
    const [selectedPDRBOption, setSelectedPDRBOption] = useState('5Y');
    const [selectedRLSOption, setSelectedRLSOption] = useState('5Y');
    const [selectedInternetOption, setSelectedInternetOption] = useState('5Y');

    return (
        <div className="relative flex flex-col h-screen overflow-hidden bg-white"> 
            
            {/* 0. WATERMARK DAC (LAYER PALING ATAS - Z-INDEX 100) */}
            <div 
                className="absolute inset-0 z-100 pointer-events-none" 
                style={{
                    backgroundImage: `url(${WatermarkDAC})`,
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.9,
                }}
            />

            {/* ======================================================= */}
            {/* KONTEN WRAPPER: Diperkecil & Dipusatkan, diberi padding */}
            {/* ======================================================= */}
            <div 
                className="w-full max-w-8xl mx-auto h-full flex flex-col relative z-20 p-8" 
            > 
                
                {/* 1. Header */}
                <div>
                    <Header />
                </div>
                
                {/* 2. KPI Grid */}
                <div 
                    className="px-6 py-4 shrink-0 rounded-lg"
                > 
                    <KPIGrid 
                        ipmFullData={fullIPMData}
                        pdrbFullData={fullPDRBData}
                        rlsFullData={fullRLSData}
                        internetFullData={fullInternetData}
                        selectedIPMOption={selectedIPMOption} 
                        setIPMOption={setSelectedIPMOption}
                        selectedPDRBOption={selectedPDRBOption}
                        setPDRBOption={setSelectedPDRBOption}
                        selectedRLSOption={selectedRLSOption}
                        setRLSOption={setSelectedRLSOption}
                        selectedInternetOption={selectedInternetOption}
                        setInternetOption={setSelectedInternetOption}
                    /> 
                </div>

                {/* 3. BLOK KONTEN UTAMA (Area Peta, Area Visualisasi Kanan, dan Footer) */}
                <div
                    className="grow grid grid-rows-[1fr_auto] grid-cols-2 overflow-hidden 
                                rounded-lg mt-0"
                >
                    
                    {/* Kiri Bawah → Map Besar */}
                    <div className="row-start-1 col-start-1 p-5 pl-2 flex items-center justify-center">
                        <div
                            className="w-[95%] h-[95%] rounded-md shadow-xl shadow-blue-400 p-3 
                                        transition-all duration-300 overflow-hidden" 
                        >
                            <MapChart height="100%" /> 
                        </div>
                    </div>

                    {/* Kanan Bawah → Area Kosong / Visualisasi */}
                    <div className="row-start-1 col-start-2 p-6 pr-8 flex items-center justify-center">
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