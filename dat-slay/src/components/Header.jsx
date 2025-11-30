import React from "react";
import { Menu, Search, Plus, SlidersHorizontal } from "lucide-react";

function Header(){
    return (
        <div className="px-6 py-2"> 
            <div className="flex items-center justify-between">
                
                <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                        <h1 className="text-4xl font-black text-primary-gradient">DASHBOARD ANALYTICS</h1> 
                        <p className="text-m text-gray-800">Berikut Tersaji Ringkasan Data Ekonomi Digital dan Tranformasi Sosial</p> 
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Header;