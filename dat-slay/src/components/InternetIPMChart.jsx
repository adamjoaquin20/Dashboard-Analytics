import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const csvUrl = '/Akses Internet vs IPM.csv';

const RunningTitle = ({ text }) => {
    return (
        <div style={{ padding: '0 10px', height: '20px', overflow: 'hidden' }}>
            <marquee behavior="scroll" direction="left" scrollamount="3" style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>
                {text}
            </marquee>
        </div>
    );
};

const chartTitle = "Tren Akses Internet dengan IPM dalam 5 Tahun Terakhir";

const useProcessedData = (rawParsedData) => {
    const filteredData = rawParsedData.filter(item => item.Tahun > 2019);
    return filteredData.map(item => ({
        Tahun: item.Tahun,
        Kenaikan_IPM: item['IPM'], 
        Kenaikan_Akses_Internet: item['Kenaikan_Akses_Internet'],
    }));
};

const InternetIPMChart = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(encodeURI(csvUrl));
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
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

    const chartData = useProcessedData(rawData);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Memuat data visualisasi...</div>;
    }

    if (chartData.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Data Kenaikan tidak ditemukan atau kosong.</div>;
    }

    return (
        <div style={{ width: '100%', height: "100%", padding: '0', position: 'relative' }}>
            <RunningTitle text={chartTitle} />
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={chartData}
                    margin={{ top: 30, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    <XAxis dataKey="Tahun" fontSize={12} />

                    <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(2)}%`, name.replace(/_/g, ' ')]}
                        labelFormatter={(label) => `Tahun: ${label}`}
                    />

                    <YAxis 
                        yAxisId="left" 
                        stroke="#10b981"
                        unit="%"
                        fontSize={11}
                    />
                    
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#f97316"
                        unit="%"
                        fontSize={11}
                    />

                    <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="Kenaikan_IPM" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={0.3}
                        name="% Kenaikan IPM Nasional"
                        fill="#10b981"
                    />
                    
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="Kenaikan_Akses_Internet" 
                        stroke="#f97316" 
                        strokeWidth={3}
                        fillOpacity={0.3}
                        name="% Kenaikan Akses Internet"
                        fill="#f97316"
                    />
                </LineChart>
            </ResponsiveContainer>
            
        </div>
    );
};

export default InternetIPMChart;