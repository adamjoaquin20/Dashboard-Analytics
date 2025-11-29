import React from "react";
import { Menu, Search, Plus, SlidersHorizontal } from "lucide-react";

function Header(){
    return (
        <div className="px-6 py-4"> 
            <div className="flex items-center justify-between">
                {/* KIRI */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-black text-white">DASHBOARD ANALYTICS</h1> {/* Teks putih */}
                        <p className="text-sm text-gray-300">Ringkasan Data Ekonomi Digital dan Tranformasi Sosial</p> {/* Teks abu-abu muda */}
                    </div>
                </div>
                {/* Bagian Kanan Header (Jika ada ikon atau elemen lain) */}
            </div>
        </div>
    )
}

export default Header;