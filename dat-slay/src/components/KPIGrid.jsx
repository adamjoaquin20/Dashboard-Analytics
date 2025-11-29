import { ArrowUpRight, ArrowDownRight, CloudLightning, Coins, Leaf, Smile, School, CoinsIcon, DollarSign, User, Users, Computer, Banknote, PiggyBank, BanknoteIcon, GitGraphIcon, Wallet, ChartBarIncreasing, ChartLine, ComputerIcon, LucideComputer, Smartphone, SmartphoneCharging, TowerControl, RadioTower } from "lucide-react";
import React from "react";

// Tentukan default props untuk menghindari error jika data belum dimuat
const defaultStats = [
    { title: "Rerata IPM Nasional", value: "N/A", change: "N/A", trend: "up", icon: Leaf },
    { title: "Total PDRB Nasional", value: "Rp.XXX.XXX.XXX", change: "+/- XX%", trend: "up", icon: Coins }, 
    { title: "Rerata Lama Sekolah", value: "N/A Tahun", change: "+/- XX Tahun", trend: "up", icon: Smile },
    { title: "% Keterjangkauan Akses Internet", value: "N/A%", change: "+/- XX pp", trend: "up", icon: CloudLightning }
];

// Terima data lengkap dan fungsi setter dari App.jsx
function KPIGrid({ 
    ipmFullData, 
    pdrbFullData, 
    rlsFullData, 
    internetFullData, 
    selectedIPMOption = '5Y', 
    setIPMOption,
    selectedPDRBOption = '5Y',
    setPDRBOption,
    selectedRLSOption = '5Y',
    setRLSOption,
    selectedInternetOption = '5Y',
    setInternetOption
}) { 
    
    console.log('Data received:', { ipmFullData, pdrbFullData, rlsFullData, internetFullData });
    console.log('Selected options:', { selectedIPMOption, selectedPDRBOption, selectedRLSOption, selectedInternetOption });
    
    // 1. Tentukan set data yang akan ditampilkan berdasarkan selectedOption masing-masing
    const currentIPMStats = ipmFullData && ipmFullData[selectedIPMOption] ? ipmFullData[selectedIPMOption] : {value: "N/A", change: "N/A", trend: "up"};
    const currentPDRBStats = pdrbFullData && pdrbFullData[selectedPDRBOption] ? pdrbFullData[selectedPDRBOption] : {value: "N/A", change: "N/A", trend: "up"};
    const currentRLSStats = rlsFullData && rlsFullData[selectedRLSOption] ? rlsFullData[selectedRLSOption] : {value: "N/A", change: "N/A", trend: "up"};
    const currentInternetStats = internetFullData && internetFullData[selectedInternetOption] ? internetFullData[selectedInternetOption] : {value: "N/A", change: "N/A", trend: "up"};

    // 2. Mapping data yang diterima ke array stats dengan selectedOption dan setter masing-masing
    const stats = [
        {
            title: "Rerata IPM Nasional",
            value: currentIPMStats.value,
            change: currentIPMStats.change,
            trend: currentIPMStats.trend,
            icon: Users,
            textColor: "text-sky-400",
            selectedOption: selectedIPMOption,
            setOption: setIPMOption
        },
        {
            title: "Total PDRB Nasional",
            value: currentPDRBStats.value,
            change: currentPDRBStats.change,
            trend: currentPDRBStats.trend,
            icon: ChartLine,
            textColor: "text-sky-400",
            selectedOption: selectedPDRBOption,
            setOption: setPDRBOption
        },
        {
            title: "Rerata Lama Sekolah",
            value: currentRLSStats.value,
            change: currentRLSStats.change,
            trend: currentRLSStats.trend,
            icon: School,
            textColor: "text-sky-400",
            selectedOption: selectedRLSOption,
            setOption: setRLSOption
        },
        {
            title: "% Keterjangkauan Akses Internet",
            value: currentInternetStats.value,
            change: currentInternetStats.change,
            trend: currentInternetStats.trend,
            icon: RadioTower,
            textColor: "text-sky-400",
            selectedOption: selectedInternetOption,
            setOption: setInternetOption
        }
    ];

    // Opsi untuk dropdown
    const options = [
        { key: '5Y', label: '5 Tahun Rerata' },
        { key: '2024', label: '2024' },
        { key: '2023', label: '2023' },
        { key: '2022', label: '2022' },
        { key: '2021', label: '2021' },
        { key: '2020', label: '2020' },
    ];

    return (
        <div className="flex flex-nowrap overflow-x-auto gap-8 z-50"> 
            {stats.map((stat, index) => {
                const isUp = stat.trend === 'up';
                const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight; 
                const trendColor = isUp ? "text-emerald-400" : "text-red-400"; 

                return (
                    <div 
                        key={index}
                        className={`shrink-0 w-72 relative
                                    bg-linear-to-br from-[#4A6085] to-[#3D5276] 
                                    backdrop-blur-sm rounded-lg p-3 pb-3 mt-4
                                    border border-[#526D97] hover:shadow-2xl hover:shadow-cyan-500/30 
                                    hover:scale-[1.01] transition-all duration-300 group cursor-pointer`}
                    >
                        {/* Konten Kartu */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                
                                {/* JUDUL */}
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
                            
                            {/* ICON INTERAKTIF */}
                            <div 
                                className={`p-2 rounded-lg bg-white/30 group-hover:bg-sky-500 
                                            group-hover:scale-110 transition-all duration-200`}
                            >
                                {<stat.icon className={`w-7 h-7 ${stat.textColor} group-hover:text-black`}/>} 
                            </div>
                        </div>

                        {/* DROPDOWN DI KANAN BAWAH KARTU (Independen untuk setiap KPI) */}
                        <div className="absolute bottom-2 right-3">
                            <select 
                                value={stat.selectedOption}
                                onChange={(e) => {
                                    if (stat.setOption) {
                                        stat.setOption(e.target.value);
                                    }
                                }}
                                className="text-xs font-medium text-white bg-transparent border border-white/30 rounded px-1 py-0.5 appearance-none cursor-pointer focus:ring-0 focus:border-white/50"
                            >
                                {options.map(opt => (
                                    <option key={opt.key} value={opt.key} className="bg-[#3D5276] text-white">{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        
                    </div>
                );
            })}
        </div>
    );
}

KPIGrid.defaultProps = {
    ipmFullData: {},
    pdrbFullData: {},
    rlsFullData: {},
    internetFullData: {},
    selectedIPMOption: '5Y',
    selectedPDRBOption: '5Y',
    selectedRLSOption: '5Y',
    selectedInternetOption: '5Y'
};

export default KPIGrid;