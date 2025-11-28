import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import indonesia from "../assets/indonesia.json";

const PetaIndonesia = () => {
  useEffect(() => {
    // Memaksa map redraw supaya tidak "blank" atau terdistorsi
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }, []);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        className="w-full h-full rounded-lg shadow"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <GeoJSON
          data={indonesia}
          style={{
            fillColor: "#4f46e5",
            weight: 1,
            color: "white",
            fillOpacity: 0.6,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default PetaIndonesia;
