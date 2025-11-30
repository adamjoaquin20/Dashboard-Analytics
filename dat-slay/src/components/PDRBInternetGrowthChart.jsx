import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"; 

const csvUrl = '/Akses Internet vs PDRB.csv';


const RunningTitle = ({ text }) => {
    
    return (
        <div style={{ padding: '0 10px', height: '20px', overflow: 'hidden' }}>
            <marquee behavior="scroll" direction="left" scrollamount="3" style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>
                {text}
            </marquee>
        </div>
    );
};


const LegendPopupLine = ({ legendData, onClose, chartTitle }) => {
    return (
        <div style={{
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            padding: '20px',
            zIndex: 1000,
            maxWidth: '300px',
        }}>
            <button 
                onClick={onClose} 
                style={{ float: 'right', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}
            >
                &times;
            </button>
            <h4 style={{ marginTop: '0', fontSize: '14px' }}>{chartTitle}</h4>
            <div style={{ marginTop: '10px' }}>
                {legendData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: item.color, 
                            marginRight: '10px',
                            borderRadius: '2px',
                        }}></div>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const chartTitle = "Tren Akses Internet dan Kenaikan PDRB Nasional";

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
    
    const [showLegend, setShowLegend] = useState(false); 

    const toggleLegend = () => setShowLegend(!showLegend); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(encodeURI(csvUrl));
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true, dynamicTyping: true, skipEmptyLines: true,
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
    
    
    const legendData = [
        { value: '% Kenaikan PDRB Nasional', color: '#8884d8' },
        { value: '% Kenaikan Akses Internet', color: 'orange' },
    ];
    

    return (
        <div style={{ width: '100%', height: "100%", padding: '0', position: 'relative' }}>
            
            
            <RunningTitle text={chartTitle} />
            
            
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
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: -10, left: -10, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Tahun" fontSize={12} />

                    <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(2)}%`, name.replace(/_/g, ' ')]}
                        labelFormatter={(label) => `Tahun: ${label}`}
                    />
                    

                    <YAxis yAxisId="left" stroke="#8884d8" unit="%" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" stroke="orange" unit="%" fontSize={11} />

                    <Line yAxisId="left" type="monotone" dataKey="Kenaikan_PDRB" stroke="#8884d8" strokeWidth={3} fillOpacity={0.3} name="% Kenaikan PDRB Nasional" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="Kenaikan_Akses_Internet" stroke="orange" strokeWidth={3} fillOpacity={0.3} name="% Kenaikan Akses Internet" fill="orange" />
                </LineChart>
            </ResponsiveContainer>
            
            
            {showLegend && (
                <LegendPopupLine 
                    legendData={legendData} 
                    onClose={toggleLegend} 
                    chartTitle={chartTitle}
                />
            )}
        </div>
    );
};

export default PDRBInternetGrowthChart;