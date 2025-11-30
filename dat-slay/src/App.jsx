import React, { useState } from 'react'; 
import Header from "./components/Header";
import KPIGrid from "./components/KPIGrid";
import MapSection from "./components/MapSection";
import WatermarkDAC from './assets/b.png'; 
import PDRBInternetGrowthChart from './components/PDRBInternetGrowthChart';
import PDRBvsLapUsahaChart from './components/PDRBvsLapUsahaChart';
import "leaflet/dist/leaflet.css";

// --- DATA STRUKTUR LENGKAP IPM NASIONAL ---
const fullIPMData = {
    "2020": {value: "71.94", change: "0.02%", trend: "up"},
    "2021": {value: "72.29", change: "0.49%", trend: "up"},
    "2022": {value: "72.91", change: "0.86%", trend: "up"},
    "2023": {value: "73.55", change: "0.88%", trend: "up"}, 
    "2024": {value: "74.20", change: "0.88%", trend: "up"},
    "5Y": {value: "72.98", change: "3.14%", trend: "up"}
};

const fullPDRBData = {
    "2020": {"value": "Rp.62,068,676", "change": "-2.23%", "trend": "N/A"},
    "2021": {"value": "Rp.67,053,176", "change": "8.03%", "trend": "up"},
    "2022": {"value": "Rp.76,817,118", "change": "14.56%", "trend": "up"},
    "2023": {"value": "Rp.79,566,500", "change": "3.58%", "trend": "up"}, 
    "2024": {"value": "Rp.84,343,737", "change": "6.00%", "trend": "up"}, 
    "5Y": {"value": "Rp.73,969,821", "change": "35.89%", "trend": "up"} 
};

const fullRLSData = {
    "2020": {"value": "8.64 Tahun", "change": "+0.1 Tahun", "trend": "up"},
    "2021": {"value": "8.72 Tahun", "change": "+0.08 Tahun", "trend": "up"},
    "2022": {"value": "8.83 Tahun", "change": "+0.11 Tahun", "trend": "up"},
    "2023": {"value": "8.92 Tahun", "change": "+0.09 Tahun", "trend": "up"},
    "2024": {"value": "8.84 Tahun", "change": "+0.08 Tahun", "trend": "N/A"},
    "5Y": {"value": "8.84 Tahun", "change": "+0.28 Tahun", "trend": "up"}
};

const fullInternetData = {
    "2020": {'value': '78.18%', 'change': '+6.00%', 'trend': 'up'},
    "2021": {'value': '82.07%', 'change': '+3.89%', 'trend': 'up'},
    "2022": {'value': '86.54%', 'change': '+4.47%', 'trend': 'up'},
    "2023": {'value': '87.09%', 'change': '+0.55%', 'trend': 'up'},
    "2024": {'value': '89.76%', 'change': '+2.67%', 'trend': 'up'},
    '5Y': {'value': '84.73%', 'change': '+11.58%', 'trend': 'up'}
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
                <div className="w-full bg-transparent">
                    <Header />
                </div>

                
                {/* 2. KPI Grid */}
                <div 
                    className="px-6 py-0 shrink-0 rounded-lg mb-4 mt-4"
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

                {/* 3. BLOK KONTEN UTAMA (Area Peta dan Area Visualisasi Kanan) */}
                <div
                    className="flex-1 grid grid-cols-2 gap-4 px-6 pb-1 overflow-hidden min-h-0 bg-w"
                >

                    {/* Kiri Bawah → Map Besar */}
                    <div className="flex items-center justify-center min-h-0 bg-white rounded-lg">
                        <div
                            className="w-full h-full rounded-md shadow-xl drop-shadow-amber-950 
                                        transition-all duration-300 overflow-hidden" 
                        >
                            <MapSection height="100%" /> 
                        </div>
                    </div>

                    {/* Kanan Bawah → Grid 2 Area (Dual Line Chart Atas, Combo Chart Bawah) */}
                    <div className="grid grid-rows-2 gap-3 min-h-0">
                        
                        {/* Area 1: Dual Line Chart (Regresi Linear) - ATAS */}
                        <div className="w-full h-full rounded-md shadow-xl drop-shadow-amber-950 
                                        transition-all duration-300 overflow-hidden bg-white min-h-0">
                            <PDRBInternetGrowthChart height="100%" /> 
                        </div>

                        {/* Area 2: Combo Chart (Bar + Line) - BAWAH */}
                        <div className="grid grid-cols-2 gap-3 min-h-0">
                          <div className="w-full h-full rounded-md  p-3 shadow-xl drop-shadow-amber-950 
                                        transition-all duration-300 overflow-hidden bg-white/80 
                                        flex flex-col items-center justify-center min-h-0">
                            <PDRBvsLapUsahaChart />
                          </div>
                          <div className="w-full h-full rounded-md  p-3 shadow-xl drop-shadow-amber-950 
                                        transition-all duration-300 overflow-hidden bg-white/80 
                                        flex flex-col items-center justify-center min-h-0">
                            <PDRBInternetGrowthChart height="100%" />
                          </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;