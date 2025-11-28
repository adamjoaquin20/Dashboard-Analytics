// src/components/ChartPadi.jsx
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { Chart } from "chart.js/auto";

export default function ChartPadi() {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [dataCSV, setDataCSV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try primary filename then fallback to sample 'data.csv'
  useEffect(() => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    const tryLoad = (path) =>
      new Promise((resolve, reject) => {
        Papa.parse(path, {
          download: true,
          header: true,
          complete: (result) => resolve(result.data),
          error: (err) => reject(err),
        });
      });

    (async () => {
      try {
        const primary = await tryLoad("/ProdPadiBerasJateng.csv");
        // if file exists but contains only empty row(s), try fallback
        const filtered = primary.filter((r) => r && (r["Produksi Padi"] || r["Kabupaten / Kota"]));
        if (filtered.length > 0) {
          setDataCSV(filtered);
        } else {
          const fallback = await tryLoad("/data.csv");
          setDataCSV(fallback.filter((r) => r && (r["Produksi Padi"] || r["Kabupaten / Kota"])));
        }
      } catch (e) {
        // fallback to sample CSV
        try {
          const fallback = await tryLoad("/data.csv");
          setDataCSV(fallback.filter((r) => r && (r["Produksi Padi"] || r["Kabupaten / Kota"])));
        } catch (err) {
          console.error("CSV load failed:", err);
          setError(err.message || String(err));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // compute summary metrics
  const metrics = (() => {
    if (!dataCSV || dataCSV.length === 0) return null;
    const vals = dataCSV.map((r) => Number(r["Produksi Padi"]) || 0);
    const total = vals.reduce((s, v) => s + v, 0);
    const avg = vals.length ? Math.round(total / vals.length) : 0;
    const top = [...dataCSV]
      .map((r) => ({ name: r["Kabupaten / Kota"], v: Number(r["Produksi Padi"]) || 0 }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 3);
    return { total, avg, top };
  })();

  // Render Chart
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!dataCSV || dataCSV.length === 0) return;

    // cleanup previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const labels = dataCSV.map((row) => row["Kabupaten / Kota"] || "");
    const values = dataCSV.map((row) => Number(row["Produksi Padi"]) || 0);

    const ctx = canvasRef.current.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(59,130,246,0.95)");
    gradient.addColorStop(1, "rgba(79,70,229,0.85)");

    chartInstanceRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Produksi Padi",
            data: values,
            backgroundColor: gradient,
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            maxBarThickness: 48,
            barPercentage: 0.8,
            categoryPercentage: 0.7,
            hoverBackgroundColor: "rgba(99,102,241,0.95)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { color: "#ffffffcc", boxWidth: 12, padding: 12 },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0,0,0,0.85)",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
            usePointStyle: true,
            callbacks: {
              label: (context) => {
                const v = context.parsed.y ?? context.raw ?? 0;
                return `Produksi: ${v.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#ffffffaa", autoSkip: true, maxRotation: 45, minRotation: 0 },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#ffffffaa" },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
        },
        layout: { padding: { top: 6, right: 6, left: 6, bottom: 6 } },
        elements: { bar: { borderRadius: 8 } },
        animation: { duration: 800, easing: "easeOutQuart" },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [dataCSV]);

  return (
    <div className="w-full p-6 bg-black/40 rounded-xl mt-10">
      <h2 className="text-center text-xl mb-4 text-white font-semibold">
        Produksi Padi per Kabupaten/Kota
      </h2>

      {loading && <div className="text-center text-sm text-white/80 mb-4">Loading data…</div>}
      {error && <div className="text-center text-sm text-red-300 mb-4">CSV load error: {error}</div>}

      {/* metrics */}
      {metrics && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/6 p-3 rounded-md">
            <div className="text-xs text-white/80">Total Produksi</div>
            <div className="text-lg font-semibold text-white">{metrics.total.toLocaleString()}</div>
          </div>
          <div className="bg-white/6 p-3 rounded-md">
            <div className="text-xs text-white/80">Rata-rata</div>
            <div className="text-lg font-semibold text-white">{metrics.avg.toLocaleString()}</div>
          </div>
          <div className="bg-white/6 p-3 rounded-md">
            <div className="text-xs text-white/80">Top 3</div>
            <div className="text-sm text-white">
              {metrics.top.map((t) => (
                <div key={t.name}>{t.name}: {t.v.toLocaleString()}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-96">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} aria-label="Produksi padi chart"></canvas>
      </div>
    </div>
  );
}
