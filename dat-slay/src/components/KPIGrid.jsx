import { ArrowUpRight, CloudLightning, Coins, Leaf, Smile } from "lucide-react";
import React from "react";

const stats = [
    {
        title: "Rerata IPM Nasional",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: Leaf,
        textColor: "text-emerald-400"
    },
    {
        title: "Total PDRB Nasional",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: Coins,
        textColor: "text-emerald-400"
    },
    {
        title: "Rerata Pendapatan Bersih",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: Smile,
        textColor: "text-emerald-400"
    },
    {
        title: "% Keterjangkauan Akses Internet",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: CloudLightning,
        textColor: "text-emerald-400"
    }
]

function KPIGrid(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 z-50"> 
            {stats.map((stat, index)=>{ 
            return(
                <div 
                    key={index}
                    // Menerapkan Gradient: dari warna yang sedikit lebih terang ke warna dasar (#3D5276)
                    className={`bg-gradient-to-br from-[#4A6085] to-[#3D5276] 
                                backdrop-blur-sm rounded-lg p-3 
                                border border-[#526D97] hover:shadow-2xl hover:shadow-cyan-500/30 
                                hover:scale-[1.01] transition-all duration-300 group cursor-pointer`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* Teks diubah ke putih/abu-abu terang agar kontras dengan gradient gelap */}
                            <p className="text-xs font-medium text-gray-200 mb-1">{stat.title}</p>
                            <p className="text-xl font-bold text-white mb-2">{stat.value}</p>
                            <div className="flex items-center space-x-1">
                                <ArrowUpRight className="text-emerald-400 w-3 h-3"/> 
                                <span className="text-xs text-gray-200">Stats Change</span>
                                <span className="text-xs text-gray-400">vs Last</span>
                            </div>
                        </div>
                        
                        {/* ICON INTERAKTIF (Dipertahankan) */}
                        <div 
                            className={`p-2 rounded-lg bg-white/30 group-hover:bg-cyan-500 
                                        group-hover:scale-110 transition-all duration-200`}
                        >
                            {/* Warna ikon disetel ke putih solid, berubah menjadi hitam saat hover */}
                            {<stat.icon className={`w-7 h-7 text-white group-hover:text-black`}/>} 
                        </div>
                    </div>
                </div>
            )
            })}
        </div>
    )
}

export default KPIGrid;