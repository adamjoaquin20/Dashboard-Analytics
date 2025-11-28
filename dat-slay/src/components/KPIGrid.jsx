import { ArrowRight, ArrowUpRight, CloudLightning, Coins, Leaf, Smile } from "lucide-react";
import React from "react";

const stats = [
    {
        title: "Rerata IPM Nasional",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: Leaf,
        color: "from-emerald-to-500 to-teal-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600"
    },
    {
        title: "Total PDRB Nasional",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: Coins,
        color: "from-emerald-to-500 to-teal-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600"
    },
    {
        title: "Rerata Pendapatan Bersih",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: Smile,
        color: "from-emerald-to-500 to-teal-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600"
    },
    {
        title: "% Keterjangkauan Akses Internet",
        value: "Rp.XXX.XXX.XXX",
        change: "+/- XX%",
        trend: "up",
        icon: CloudLightning,
        color: "from-emerald-to-500 to-teal-600",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600"
    }
]

function KPIGrid(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 z-50 px-15 py-38">
            {stats.map((stats, index)=>{
            return(
                <div className="bg-emerald-100/50 backdrop-blur-sm rounded-lg p-3 
                border border-emerald-700/20 hover:shadow-md hover:shadow-slate-200/10 
                transition-all duration-300 group" key={index}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{stats.title}</p>
                        <p className="text-xl font-bold text-primary dark:text-white mb-2">{stats.value}</p>
                        <div className="flex items-center space-x-1">
                            <ArrowUpRight className="text-emerald-400 w-3 h-3"/>
                            <span className="text-xs">Stats Change</span>
                            <span className="text-xs text-primary-solid dark:text-slate-400">vs Last</span>
                        </div>
                    </div>
                    <div className={'p-2 rounded-lg group-hover:scale-110 transition-all duration-200'}>
                        {<stats.icon className={`w-7 h-7 ${stats.textColor}`}/>}
                    </div>
                </div>
                <div className="bg-slate-100 rounded-full overflow-hidden">
                    <div className={`w-full bg-linear-to-r rounded-full transition-all duration-100`}></div>
                </div>
            </div>
            )
            })}
        </div>
    )
}

export default KPIGrid;