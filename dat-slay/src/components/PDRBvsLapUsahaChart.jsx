import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
    PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer
} from "recharts"; 

const csvUrl = '/PDRB Menurut Lapangan Usaha.csv'; 
const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#A0522D', '#D2691E', '#CD5C5C', '#40E0D0', '#FFD700',
    '#7CFC00', '#DA70D6', '#B0C4DE', '#7FFFD4', '#F08080',
    '#6A5ACD', '#4682B4'
];
const TOP_N_SECTORS = 7; 

const RunningTitle = ({ text }) => {
    // Definisi Keyframes dan Styles untuk animasi
    const scrollStyles = {
        '@keyframes scroll-left': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
        },
        container: {
            // Container yang membatasi tampilan teks
            overflow: 'hidden', 
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
            height: '20px', // Atur tinggi agar tidak mengganggu tata letak
            marginBottom: '3px',
        },
        text: {
            // Teks yang akan digerakkan
            display: 'inline-block',
            paddingLeft: '100%', // Mulai dari luar container
            animation: 'scroll-left 10s linear infinite', // Durasi 10s, linear, berulang
            fontWeight: '600',
            fontSize: '14px',
            color: '#333',
        },
    };
    return (
        <div style={{ padding: '0 10px', height: '20px', overflow: 'hidden' }}>
            <marquee behavior="scroll" direction="left" scrollamount="3" style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>
                {text}
            </marquee>
        </div>
    );
};


// --- Komponen Legend Popup ---
const LegendPopup = ({ legendData, onClose, chartTitle }) => {
    return (
        <div style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            zIndex: 1000,
            maxWidth: '300px',
        }}>
            <button 
                onClick={onClose} 
                style={{ 
                    float: 'right', 
                    border: 'none', 
                    background: 'none', 
                    fontSize: '18px', 
                    cursor: 'pointer' 
                }}
            >
                &times;
            </button>
            <h4 style={{ marginTop: '0' }}>{chartTitle} (Top 7)</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {legendData.map((item, index) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: item.color, 
                            marginRight: '10px',
                            borderRadius: '2px',
                        }}></div>
                        <span style={{ fontSize: '11px', lineHeight: '1.2' }}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Komponen Utama ---
const PDRBvsLapUsahaChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    // 1. State baru untuk mengontrol visibilitas Legend (default: true/terlihat)
    const [showLegend, setShowLegend] = useState(false); 

    // 2. Handler untuk mengubah state visibilitas
    const toggleLegend = () => {
        setShowLegend(!showLegend);
    };

    // [Bagian Fetching dan Parsing Data (useEffect) - Tidak Berubah]
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(csvUrl);
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true, dynamicTyping: true, skipEmptyLines: true,
                    complete: (results) => {
                        let rawData = results.data;
                        const totalSum = rawData.reduce((sum, item) => sum + item['PDRB'], 0);
                        let processedData = rawData.map(item => ({
                            lapangan_usaha: item['Lapangan Usaha'], 
                            value: item['PDRB'],
                            percentage: (item['PDRB'] / totalSum) * 100,
                        }));
                        processedData.sort((a, b) => b.value - a.value);
                        setData(processedData);
                        setLoading(false);
                    },
                    error: (error) => {
                        console.error("PapaParse Error:", error);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error("Fetch Error:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Memuat data sektor ekonomi...</div>;
    }

    if (data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Data Lapangan Usaha tidak ditemukan.</div>;
    }

    // --- LOGIKA TOP 7 UNTUK LEGEND DAN PIE CHART ---
    const topNData = data.slice(0, TOP_N_SECTORS);
    const legendData = topNData.map((item, index) => ({
        value: item.lapangan_usaha, type: 'square', id: `legend-${index}`, color: COLORS[index],
    }));
    
    let dataForPie = topNData; 

    if (data.length > TOP_N_SECTORS) {
        const remainingData = data.slice(TOP_N_SECTORS);
        const otherSum = remainingData.reduce((sum, item) => sum + item.value, 0);
        const otherPercentage = remainingData.reduce((sum, item) => sum + item.percentage, 0);
        
        const otherItem = {
            lapangan_usaha: 'Sektor Lainnya',
            value: otherSum,
            percentage: otherPercentage,
        };

        legendData.push({
            value: 'Sektor Lainnya', type: 'square', id: 'legend-others', color: COLORS[TOP_N_SECTORS],
        });

        dataForPie = [...topNData, otherItem];
    }
    // -----------------------------------------------------

    const renderTooltipContent = ({ payload }) => {
        if (payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div style={{ padding: '8px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '12px' }}>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{item.lapangan_usaha}</p>
                    <p style={{ margin: 0 }}>PDRB: {item.value.toLocaleString('id-ID')}</p>
                    <p style={{ margin: 0 }}>Kontribusi: {item.percentage ? item.percentage.toFixed(2) : (item.value / dataForPie.reduce((s, i) => s + i.value, 0) * 100).toFixed(2)}%</p>
                </div>
            );
        }
        return null;
    };

    // 4. Rendering Donut Chart dengan Toggle
    const chartTitle = "Top 7 % Kontribusi PDRB Menurut Lapangan Usaha";

    return (
        <div style={{ width: '100%', height: '100%', padding: '0', position: 'relative' }}>

            <RunningTitle text={chartTitle} />
            {/* 3. Tombol Toggle Legend (Klik untuk melihat) */}
            <button
                onClick={toggleLegend}
                style={{
                    position: 'absolute',
                    top: '30px',
                    right: '5px',
                    zIndex: 10,
                    padding: '4px 8px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                }}
            >
                {showLegend ? 'Tutup Legenda ✕' : 'Lihat Legenda ⓘ'}
            </button>

            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    
                    {/* HILANGKAN ELEMEN <Legend> DARI SINI */}
                    
                    <Tooltip content={renderTooltipContent} />
                    
                    <Pie
                        data={dataForPie}
                        dataKey="value"
                        nameKey="lapangan_usaha"
                        cx="50%" // Chart selalu di tengah karena tidak ada Legend di samping
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        fill="#8884d8"
                        labelLine={false}
                    >
                        {
                            dataForPie.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                        }
                    </Pie>
                </PieChart>
                
            </ResponsiveContainer>

            
            

            {/* Render Popup di luar chart saat showLegend true */}
            {showLegend && (
                <LegendPopup 
                    legendData={legendData} 
                    onClose={toggleLegend} 
                    chartTitle={chartTitle}
                />
            )}
        </div>
    );
};

export default PDRBvsLapUsahaChart;