import React from "react";
import { Menu, Search, Plus, SlidersHorizontal } from "lucide-react";

function Header(){
    return (
        <div className="px-6 py-2 shadow-xl drop-shadow-amber-950"> 
            <div className="flex items-center justify-between">
                {/* KIRI */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                        <h1 className="text-4xl font-black text-primary-gradient">DASHBOARD ANALYTICS</h1> {/* Teks putih */}
                        <p className="text-m text-gray-800">Berikut Tersaji Ringkasan Data Ekonomi Digital dan Tranformasi Sosial</p> {/* Teks abu-abu muda */}
                    </div>
                </div>
                {/* Bagian Kanan Header (Jika ada ikon atau elemen lain) */}
            </div>
        </div>
    )
}

export default Header;