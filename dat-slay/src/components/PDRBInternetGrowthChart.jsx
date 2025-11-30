import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const csvUrl = '/Akses Internet vs PDRB.csv';

const useProcessedData = (rawParsedData) => {
    const filteredData = rawParsedData.filter(item => item.Tahun > 2019);
    return filteredData.map(item => ({
        Tahun: item.Tahun,
        Kenaikan_PDRB: item['Kenaikan_PDRB'], 
        Kenaikan_Akses_Internet: item['Kenaikan_Akses_Internet'],
    }));
};

const PDRBInternetGrowthChart = () => {
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
        <div style={{ width: '100%', height: "100%", padding: '0' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    <XAxis dataKey="Tahun" fontSize={12} />

                    <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(2)}%`, name.replace(/_/g, ' ')]}
                        labelFormatter={(label) => `Tahun: ${label}`}
                    />
                    <Legend verticalAlign="bottom" height={30} fontSize={3} />

                    <YAxis 
                        yAxisId="left" 
                        stroke="#8884d8"
                        unit="%"
                        fontSize={11}
                    />
                    
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="orange"
                        unit="%"
                        fontSize={11}
                    />

                    <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="Kenaikan_PDRB" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        fillOpacity={0.3}
                        name="% Kenaikan PDRB Nasional"
                        fill="#8884d8"
                    />
                    
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="Kenaikan_Akses_Internet" 
                        stroke="orange" 
                        strokeWidth={3}
                        fillOpacity={0.3}
                        name="% Kenaikan Akses Internet"
                        fill="orange"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PDRBInternetGrowthChart;