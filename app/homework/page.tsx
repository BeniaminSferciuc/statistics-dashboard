"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Gauge,
  Fuel,
  MapPin,
  Settings2,
  Phone,
  ArrowRight,
  Car,
  Palette,
  Component,
  Zap,
  RefreshCcw,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Definim interfețele identic cu backend-ul
interface CarSpecs {
  model: string;
  power: string;
  bodyType: string;
  color: string;
  year: string;
  mileage: string;
  fuel: string;
  engine: string;
  transmission: string;
}

interface CarData {
  title: string;
  price: string;
  location: string;
  specs: CarSpecs;
  description: string;
  images: string[];
  phoneNumber: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CarData | null>(null);
  const [error, setError] = useState("");

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/scrape-olx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Eroare la extragerea datelor");
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "A apărut o eroare neașteptată"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setUrl("");
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      {/* --- BACKGROUND IMAGE COOL --- */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2583&auto=format&fit=crop")',
        }}
      >
        {/* Overlay Dark Gradient pentru contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-slate-900/80 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-6xl z-10 relative">
        {/* --- STARE DE CĂUTARE (Vizibil doar când nu avem date) --- */}
        {!data && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in zoom-in duration-500">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 drop-shadow-2xl text-center">
              OLX Scraper Pro
            </h1>
            <p className="text-slate-300 text-lg mb-10 text-center max-w-2xl font-light">
              Introdu link-ul anunțului și extrage automat specificațiile
              tehnice, prețul real și detaliile ascunse.
            </p>

            <form
              onSubmit={handleScrape}
              className="w-full max-w-2xl relative group"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

              <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl">
                <div className="pl-6 pr-2 text-white/70">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.olx.ro/d/oferta/..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 text-lg py-3"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black hover:bg-slate-200 px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Extrage"
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-8 flex items-center gap-3 bg-red-500/20 backdrop-blur-md border border-red-500/50 px-6 py-3 rounded-xl text-red-200 animate-in slide-in-from-bottom-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* --- REZULTATE (Vizibil doar când avem date) --- */}
        {data && (
          <div className="animate-in slide-in-from-bottom-10 duration-700 pb-10">
            {/* Buton Reset */}
            <button
              onClick={handleReset}
              className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm"
            >
              <RefreshCcw className="w-4 h-4" /> Caută altă mașină
            </button>

            {/* Card Principal - Intense Glass Effect */}
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/20 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-white">
              {/* Header Card */}
              <div className="p-8 md:p-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-start gap-6 bg-gradient-to-r from-white/5 to-transparent">
                <div className="space-y-2 max-w-3xl">
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    {data.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm md:text-base">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {data.location || "Locație necunoscută"}
                    </div>
                    {data.phoneNumber && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300">
                        <Phone className="w-3 h-3" />
                        {data.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                    Preț Cerut
                  </p>
                  <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600 drop-shadow-lg">
                    {data.price}
                  </div>
                </div>
              </div>

              {/* Galerie Imagini (Top 4) */}
              {data.images.length > 0 && (
                <div className="grid grid-cols-4 gap-1 h-64 md:h-96 w-full">
                  {data.images.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      className={`relative overflow-hidden group ${i === 0 ? "col-span-2 row-span-2" : "col-span-2 md:col-span-1"}`}
                    >
                      <img
                        src={img}
                        alt={`Car ${i}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>
              )}

              {/* Grid Specificații - Căsuțele cerute */}
              <div className="p-8 md:p-12">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Settings2 className="w-6 h-6 text-blue-400" /> Specificații
                  Tehnice
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <SpecBox
                    icon={<Car />}
                    label="Model"
                    value={data.specs.model}
                  />
                  <SpecBox
                    icon={<Zap />}
                    label="Putere"
                    value={data.specs.power}
                  />
                  <SpecBox
                    icon={<Component />}
                    label="Caroserie"
                    value={data.specs.bodyType}
                  />
                  <SpecBox
                    icon={<Palette />}
                    label="Culoare"
                    value={data.specs.color}
                  />
                  <SpecBox
                    icon={<Calendar />}
                    label="An Fabricație"
                    value={data.specs.year}
                  />
                  <SpecBox
                    icon={<Gauge />}
                    label="Rulaj"
                    value={data.specs.mileage}
                  />
                  <SpecBox
                    icon={<Fuel />}
                    label="Combustibil"
                    value={data.specs.fuel}
                  />
                  <SpecBox
                    icon={<Settings2 />}
                    label="Motorizare"
                    value={data.specs.engine}
                  />
                  <SpecBox
                    icon={<Settings2 className="rotate-90" />}
                    label="Transmisie"
                    value={data.specs.transmission}
                  />
                </div>

                {/* Descriere */}
                <div className="mt-12 pt-12 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-4">Descriere Vânzător</h3>
                  <div className="bg-black/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/5">
                    <p className="whitespace-pre-line text-white/80 leading-relaxed font-light">
                      {data.description || "Nu există descriere disponibilă."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Componenta pentru Căsuțele de Specificații (Empty State inclus)
function SpecBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  const isEmpty = !value || value.trim() === "";

  return (
    <div
      className={`
      relative p-4 rounded-2xl border transition-all duration-300
      ${
        isEmpty
          ? "bg-white/5 border-white/5 text-white/30"
          : "bg-white/10 border-white/20 hover:bg-white/20 text-white"
      }
    `}
    >
      <div className={`mb-2 ${isEmpty ? "opacity-30" : "text-blue-400"}`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-1">
        {label}
      </p>
      <p className="text-lg md:text-xl font-bold truncate">
        {isEmpty ? "—" : value}
      </p>
    </div>
  );
}
