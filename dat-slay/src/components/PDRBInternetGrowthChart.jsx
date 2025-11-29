import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// The CSV lives in the `public/` folder. Use a URL path instead of importing from src.
const csvUrl = '/Akses Internet vs PDRB.csv';

// --- Utility: Pre-processing Data (Sudah dijelaskan di atas) ---
const useProcessedData = (rawParsedData) => {
    const filteredData = rawParsedData.filter(item => item.Tahun > 2020);
    return filteredData.map(item => ({
        Tahun: item.Tahun,
        // Nama key disesuaikan dengan header hasil PapaParse
        Kenaikan_PDRB: item['Kenaikan_PDRB'], 
        Kenaikan_Akses_Internet: item['Kenaikan_Akses_Internet'],
    }));
};
// -----------------------------------------------------------------


const PDRBInternetGrowthChart = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetching dan Parsing Data (Langkah sebelumnya)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch from public folder (encode spaces in filename)
                const response = await fetch(encodeURI(csvUrl));
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    // Pastikan transformasi header konsisten dengan data Anda
                    transformHeader: header => header.trim().replace(/ \(\%\)/g, '').replace(/ /g, '_'),
                    
                    complete: (results) => {
                        setRawData(results.data);
                        setLoading(false);
                    },
                });

            } catch (error) {
                console.error("Error fetching or parsing CSV:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Pemrosesan Data untuk Chart
    const chartData = useProcessedData(rawData);

    // 3. Conditional Rendering
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Memuat data visualisasi...</div>;
    }

    if (chartData.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Data Kenaikan tidak ditemukan atau kosong.</div>;
    }

    // 4. Rendering Dual Line Chart
    return (
        <div style={{ width: '100%', height: "100%", padding: '2px' }}>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: -1 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    {/* Sumbu X: Tahun */}
                    <XAxis dataKey="Tahun" fontSize={10} />

                    {/* Tooltip untuk menampilkan data saat kursor diarahkan */}
                    <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(2)}%`, name.replace(/_/g, ' ')]}
                        labelFormatter={(label) => `Tahun: ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} fontSize={8} />

                    {/* Sumbu Y Kiri: Kenaikan PDRB (Garis Biru) */}
                    <YAxis 
                        yAxisId="left" 
                        stroke="#8884d8"
                        unit="%"
                        fontSize={10}
                    />
                    
                    {/* Sumbu Y Kanan: Kenaikan Akses Internet (Garis Hijau) */}
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#82ca9d"
                        unit="%"
                        fontSize={10}
                        fontWeight={10}
                    />

                    {/* Garis 1: Kenaikan PDRB */}
                    <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="Kenaikan_PDRB" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Kenaikan PDRB"
                    />
                    
                    {/* Garis 2: Kenaikan Akses Internet */}
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="Kenaikan_Akses_Internet" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Kenaikan Akses Internet"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PDRBInternetGrowthChart;