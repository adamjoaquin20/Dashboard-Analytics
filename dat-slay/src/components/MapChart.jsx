import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import * as topojson from "topojson-client";

const geoUrl = "/PROVINCE.json";
const csvUrl = "/IPM 2020.csv";

const MapChart = ({ height = "600px", maxWidth = "100%" }) => {
  const [geoData, setGeoData] = useState(null);
  const [csvData, setCsvData] = useState({});

  const colorScale = scaleLinear()
    .domain([60, 80])
    .range(["#ffedea", "#ff5233"]);

  useEffect(() => {
    csv(csvUrl).then((data) => {
      const lookup = {};
      data.forEach((row) => {
        const name = (row.Province || "").toUpperCase();
        const val = parseFloat(row.Value);
        lookup[name] = isNaN(val) ? 0 : val;
      });
      setCsvData(lookup);
    });

    fetch(geoUrl)
      .then((res) => res.json())
      .then((json) => {
        let features = [];
        if (json.type === "Topology") {
            const layerName = "PROVINCE";
            if (json.objects[layerName]) {
                const converted = topojson.feature(json, json.objects[layerName]);
                features = converted.features;
            }
        } else if (json.type === "FeatureCollection") {
            features = json.features;
        }
        setGeoData(features);
      })
      .catch(err => console.error("Map Load Error:", err));
  }, []);

  const styleProvince = (feature) => {
    const propName = feature.properties.PROVINSI || feature.properties.name;
    const jsonName = (propName || "").toUpperCase();
    const value = csvData[jsonName];

    return {
      fillColor: value ? colorScale(value) : "#EEE", 
      weight: 1,           
      opacity: 1,
      color: "#888",     
      dashArray: "",
      fillOpacity: 1
    };
  };

  const onEachFeature = (feature, layer) => {
    const propName = feature.properties.PROVINSI;
    const jsonName = (propName || "").toUpperCase();
    const value = csvData[jsonName];
    
    layer.bindTooltip(`
      <div style="font-weight:bold">${propName}</div>
      <div>IPM: ${value || "No Data"}</div>
    `, {
      permanent: false,
      direction: "top"
    });

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: "#333",
          fillOpacity: 0.8
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        const originalVal = csvData[jsonName];
        layer.setStyle({
          fillColor: originalVal ? colorScale(originalVal) : "#EEE",
          weight: 1,
          color: "#888",
          fillOpacity: 1
        });
      }
    });
  };

  if (!geoData) return <div>Loading Map...</div>;

  return (
    <div className="bg-emerald-100/70" style={{ 
        height: height, 
        width: "100%", 
        maxWidth: maxWidth, 
        margin: "0 auto",
        borderRadius: "8px", 
        overflow: "hidden"   
    }}>
      <MapContainer 
        center={[-2.5, 118]} 
        zoom={5} 
        style={{ height: "100%", width: "100%", background: "transparent" }}
        scrollWheelZoom={false}
      >
        {geoData && (
          <GeoJSON 
            key={Object.keys(csvData).length}
            data={geoData} 
            style={styleProvince} 
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapChart;