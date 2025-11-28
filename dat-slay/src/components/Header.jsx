import React from "react";
import { Menu, Search, Plus, SlidersHorizontal } from "lucide-react";

function Header(){
    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-15 py-10">
            <div className="flex items-center justify-between">
                {/* KIRI */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block">
                                <h1 className=" text-5xl font-black text-primary">Dashboard Analytics</h1>
                                <p className="text-l text-slate-800">Berikut adalah Ringkasan Data Ekonomi Digital dan Tranformasi Sosial</p>
                            </div>
                        </div>
            </div>
        </div>
    )
}

export default Header;