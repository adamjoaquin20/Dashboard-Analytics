import { ArrowUpRight, ArrowDownRight, CloudLightning, Coins, Leaf, Smile } from "lucide-react";
import React from "react";

// Tentukan default props untuk menghindari error jika data belum dimuat
const defaultStats = [
    { title: "Rerata IPM Nasional", value: "N/A", change: "N/A", trend: "up", icon: Leaf },
    { title: "Total PDRB Nasional", value: "Rp.XXX.XXX.XXX", change: "+/- XX%", trend: "up", icon: Coins }, 
    { title: "Rerata Pendapatan Bersih", value: "Rp.XXX.XXX.XXX", change: "+/- XX%", trend: "up", icon: Smile },
    { title: "% Keterjangkauan Akses Internet", value: "Rp.XXX.XXX.XXX", change: "+/- XX%", trend: "up", icon: CloudLightning }
];

// Terima data lengkap dan fungsi setter dari App.jsx
function KPIGrid({ ipmFullData, selectedOption, setIPMOption }) { 
    
    // 1. Tentukan set data yang akan ditampilkan berdasarkan selectedOption
    const currentIPMStats = ipmFullData ? ipmFullData[selectedOption] : defaultStats[0];

    // 2. Mapping data yang diterima ke array stats
    const stats = defaultStats.map((stat, index) => {
        if (index === 0) {
            // Ganti KPI pertama dengan data dinamis IPM
            return {
                ...stat,
                value: currentIPMStats.value,
                change: currentIPMStats.change,
                trend: currentIPMStats.trend,
                textColor: "text-sky-400" 
            };
        }
        return {
            ...stat,
            textColor: "text-sky-400"
        };
    });

    // Opsi untuk dropdown
    const options = [
        { key: '5Y', label: '5 Tahun Rerata' },
        { key: '2024', label: '2024' },
        { key: '2023', label: '2023' },
        { key: '2022', label: '2022' },
        { key: '2021', label: '2021' },
        { key: '2020', label: '2020' },
    ];
    
    const handleDropdownChange = (event) => {
        if (setIPMOption) {
            setIPMOption(event.target.value);
        }
    };


    return (
        <div className="flex flex-nowrap overflow-x-auto gap-8 z-50"> 
            {stats.map((stat, index) => {
                const isUp = stat.trend === 'up';
                const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight; 
                const trendColor = isUp ? "text-emerald-400" : "text-red-400"; 

                return (
                    <div 
                        key={index}
                        className={`shrink-0 w-72 relative // Tambah relative untuk positioning dropdown
                                    bg-linear-to-br from-[#4A6085] to-[#3D5276] 
                                    backdrop-blur-sm rounded-lg p-3 pb-3 mt-4 // Tambah padding bawah untuk dropdown
                                    border border-[#526D97] hover:shadow-2xl hover:shadow-cyan-500/30 
                                    hover:scale-[1.01] transition-all duration-300 group cursor-pointer`}
                    >
                        {/* Konten Kartu */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                
                                {/* JUDUL DIKEMBALIKAN */}
                                <p className="text-xs font-medium text-gray-200 mb-1">{stat.title}</p>
                                
                                <p className="text-xl font-bold text-white mb-2">{stat.value}</p>
                                
                                <div className="flex items-center space-x-1">
                                    <TrendIcon className={`${trendColor} w-3 h-3`}/> 
                                    <span className="text-xs text-gray-200">Stats Change</span>
                                    <span className="text-xs text-gray-400">
                                        {stat.change === 'N/A' ? 'vs Baseline' : stat.change}
                                    </span> 
                                </div>
                            </div>
                            
                            {/* ICON INTERAKTIF (Dipertahankan) */}
                            <div 
                                className={`p-2 rounded-lg bg-white/30 group-hover:bg-sky-500 
                                            group-hover:scale-110 transition-all duration-200`}
                            >
                                {<stat.icon className={`w-7 h-7 ${stat.textColor} group-hover:text-black`}/>} 
                            </div>
                        </div>

                        {/* DROPDOWN BARU DI KANAN BAWAH KARTU (Hanya untuk KPI pertama) */}
                        {index === 0 && (
                            <div className="absolute bottom-2 right-3">
                                <select 
                                    value={selectedOption}
                                    onChange={handleDropdownChange}
                                    className="text-xs font-medium text-white bg-transparent border border-white/30 rounded px-1 py-0.5 appearance-none cursor-pointer focus:ring-0 focus:border-white/50"
                                >
                                    {options.map(opt => (
                                        // Menggunakan opsi bahasa yang lebih pendek untuk dropdown
                                        <option key={opt.key} value={opt.key} className="bg-[#3D5276] text-white">{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                    </div>
                );
            })}
        </div>
    );
}

KPIGrid.defaultProps = {
    ipmFullData: {},
    selectedOption: '5Y'
};

export default KPIGrid;