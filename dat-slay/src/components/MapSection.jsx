import React, { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import * as topojson from "topojson-client";
import { Layers, Calendar, ChevronDown, ChevronUp } from "lucide-react"; 

const GEO_URL = "/PROVINCE.json";


const METRICS = {
  IPM: {
    id: "IPM",
    label: "Indeks Pembangunan Manusia",
    filePrefix: "IPM", 
    csvColumn: "IPM", 
    colorRange: ["#fff7ed", "#c2410c"], 
    unit: "",
  },
  RLS: {
    id: "RLS",
    label: "Rata-Rata Lama Sekolah",
    filePrefix: "RLS", 
    csvColumn: "RLS", 
    colorRange: ["#f0f9ff", "#0369a1"], 
    unit: " Tahun",
  },
};

const YEARS = ["2020", "2021", "2022", "2023", "2024"];

const MapSection = ({ height = "100%" }) => {
  const [geoData, setGeoData] = useState(null);
  const [csvData, setCsvData] = useState({});
  const [selectedMetric, setSelectedMetric] = useState("IPM");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [dataRange, setDataRange] = useState([0, 100]); 
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  
  const handleMetricChange = (e) => {
    setLoading(true);
    setSelectedMetric(e.target.value);
  };

  const handleYearChange = (year) => {
    setLoading(true);
    setSelectedYear(year);
  };

  
  useEffect(() => {
    let isMounted = true;
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        let features = [];
        if (json.type === "Topology") {
          const layerName = "PROVINCE"; 
          if (json.objects[layerName]) {
            features = topojson.feature(json, json.objects[layerName]).features;
          }
        } else if (json.type === "FeatureCollection") {
          features = json.features;
        }
        setGeoData(features);
      })
      .catch((err) => console.error("GeoJSON Error:", err));
      
    return () => { isMounted = false; };
  }, []);

  
  useEffect(() => {
    let isMounted = true;

    const config = METRICS[selectedMetric];
    const fileName = `/${config.filePrefix} ${selectedYear}.csv`;

    csv(fileName)
      .then((data) => {
        if (!isMounted) return;

        const lookup = {};
        const values = [];

        data.forEach((row) => {
          const name = (row.Provinsi || "").trim().toUpperCase();
          const valString = row[config.csvColumn];
          const val = parseFloat(valString);

          if (!isNaN(val)) {
            lookup[name] = val;
            values.push(val);
          } else {
            lookup[name] = 0;
          }
        });

        
        setCsvData(lookup);
        if (values.length > 0) {
          setDataRange([min(values), max(values)]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(`Error loading ${fileName}:`, err);
        setCsvData({});
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedMetric, selectedYear]);

  
  const colorScale = useMemo(() => {
    return scaleLinear()
      .domain(dataRange)
      .range(METRICS[selectedMetric].colorRange);
  }, [dataRange, selectedMetric]);

  
  const styleProvince = useCallback((feature) => {
    const propName = feature.properties.PROVINSI || feature.properties.name;
    const jsonName = (propName || "").toUpperCase();
    const value = csvData[jsonName];

    return {
      fillColor: value ? colorScale(value) : "#EEE",
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.9,
    };
  }, [csvData, colorScale]);

  
  const onEachFeature = useCallback((feature, layer) => {
    const propName = feature.properties.PROVINSI;
    const jsonName = (propName || "").toUpperCase();
    const value = csvData[jsonName];
    const config = METRICS[selectedMetric];

    layer.bindTooltip(
      `
      <div class="px-2 py-1">
        <div class="text-xs font-bold text-gray-500 uppercase tracking-wider">${propName}</div>
        <div class="text-lg font-bold text-gray-800">
          ${value ? value.toFixed(2) + config.unit : "No Data"}
        </div>
        <div class="text-xs text-gray-400 mt-1">${config.label} (${selectedYear})</div>
      </div>
    `,
      {
        permanent: false,
        direction: "top",
        className: "custom-leaflet-tooltip shadow-lg rounded-lg border-0",
      }
    );

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#666",
          dashArray: "",
          fillOpacity: 1,
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        const originalVal = csvData[jsonName];
        layer.setStyle({
          fillColor: originalVal ? colorScale(originalVal) : "#EEE",
          weight: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.9,
        });
      },
    });
  }, [csvData, colorScale, selectedMetric, selectedYear]);

  if (!geoData)
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 animate-pulse rounded-lg">
        <span className="text-gray-400 font-medium">Loading Topology...</span>
      </div>
    );

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-white" style={{ height }}>
      
      
      <div 
        className={`absolute top-4 right-4 z-500 flex flex-col bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-white/50 w-64 transition-all duration-300 ease-in-out ${isExpanded ? 'p-4' : 'p-3'}`}
      >
        
        <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest select-none">Filter Data</span>
            </div>
            <button className="text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
        </div>

        
        <div className={`flex flex-col gap-3 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
            
            
            <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Kategori</label>
            <select
                value={selectedMetric}
                onChange={handleMetricChange}
                className="w-full text-sm p-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer hover:bg-white"
            >
                {Object.values(METRICS).map((m) => (
                <option key={m.id} value={m.id}>
                    {m.label}
                </option>
                ))}
            </select>
            </div>

            
            <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3"/> Tahun
            </label>
            <div className="grid grid-cols-5 gap-1">
                {YEARS.map((y) => (
                <button
                    key={y}
                    onClick={() => handleYearChange(y)}
                    className={`text-xs py-1.5 rounded-md transition-all font-medium
                    ${
                        selectedYear === y
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }
                    `}
                >
                    {y}
                </button>
                ))}
            </div>
            </div>

            
            <div className="pt-3 mt-1 border-t border-gray-100">
            <div className="flex justify-between items-end text-xs text-gray-500 mb-1">
                <span>Low ({dataRange[0].toFixed(1)})</span>
                <span>High ({dataRange[1].toFixed(1)})</span>
            </div>
            <div 
                className="h-2 w-full rounded-full"
                style={{
                background: `linear-gradient(to right, ${METRICS[selectedMetric].colorRange[0]}, ${METRICS[selectedMetric].colorRange[1]})`
                }}
            />
            {loading && <p className="text-[10px] text-center text-emerald-600 mt-2 animate-pulse">Updating Data...</p>}
            </div>
        </div>
      </div>

      
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        style={{ height: "100%", width: "100%", background: "#f8fafc" }}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <GeoJSON
          key={`${selectedMetric}-${selectedYear}`} 
          data={geoData}
          style={styleProvince}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default MapSection;