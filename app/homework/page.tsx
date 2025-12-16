"use client";

import React, { useState } from "react";
import {
  Calendar,
  Gauge,
  MapPin,
  Phone,
  ArrowUpRight,
  CarFront,
  Zap,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Fuel,
  GitCompare,
  CheckCircle2,
  ImageIcon,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CarSpecs = {
  model: string;
  power: string;
  bodyType: string;
  color: string;
  year: string;
  mileage: string;
  fuel: string;
  engine: string;
  transmission: string;
};

type CarData = {
  title: string;
  price: string;
  location: string;
  specs: CarSpecs;
  description: string;
  images: string[];
  phoneNumber: string;
};

export default function VehicleComparePro() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [dataA, setDataA] = useState<CarData | null>(null);
  const [dataB, setDataB] = useState<CarData | null>(null);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");

  const fetchCar = async (url: string, side: "A" | "B") => {
    if (!url) return;
    const setLoading = side === "A" ? setLoadingA : setLoadingB;
    const setData = side === "A" ? setDataA : setDataB;
    const setError = side === "A" ? setErrorA : setErrorB;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/scrape-olx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed.");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDataA(null);
    setDataB(null);
    setUrlA("");
    setUrlB("");
    setErrorA("");
    setErrorB("");
  };

  const hasData = dataA || dataB;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 h-full w-full">
        <div className="relative mb-12">
          {hasData && (
            <div className="sticky top-0 z-10">
              <button
                onClick={handleReset}
                className="flex items-center mb-4 gap-2.5 px-6 py-2.5 rounded-full text-sm font-medium text-foreground bg-muted/60 hover:bg-muted transition-all active:scale-95 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New Comparison</span>
              </button>
            </div>
          )}
          {!hasData && (
            <div className="text-center mb-16 space-y-3">
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-neutral-900">
                Compare your next ride.
              </h1>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto text-pretty mt-8">
                Paste two URLs below to generate a side-by-side technical and
                visual comparison instantly.
              </p>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-[0_0_16px_rgba(0,0,0,0.025)]">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 divide-zinc-200 relative">
              <div className="flex-1 p-6 relative group">
                <UrlInput
                  side="Left"
                  url={urlA}
                  setUrl={setUrlA}
                  loading={loadingA}
                  onSearch={() => fetchCar(urlA, "A")}
                  activeData={dataA}
                  error={errorA}
                  color="indigo"
                />
              </div>

              {!hasData && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex">
                  <div className="size-40 bg-zinc-900 rounded-full flex items-center justify-center border-8 border-zinc-50">
                    <span className="text-7xl font-black text-white">VS</span>
                  </div>
                </div>
              )}

              <div className="flex-1 p-6 relative group">
                <UrlInput
                  side="Right"
                  url={urlB}
                  setUrl={setUrlB}
                  loading={loadingB}
                  onSearch={() => fetchCar(urlB, "B")}
                  activeData={dataB}
                  error={errorB}
                  color="rose"
                />
              </div>
            </div>
          </div>
        </div>

        {hasData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CarHeaderCard data={dataA} label="Vehicle A" color="indigo" />
              <CarHeaderCard data={dataB} label="Vehicle B" color="rose" />
            </div>

            <div className="bg-white rounded-3xl shadow-[0_0_16px_rgba(0,0,0,0.025)] overflow-hidden">
              <div className="divide-y divide-zinc-100">
                <CompareRow
                  label="Price"
                  valA={dataA?.price}
                  valB={dataB?.price}
                  icon={<DollarSign className="w-4 h-4" />}
                  highlight
                />
                <CompareRow
                  label="Year"
                  valA={dataA?.specs.year}
                  valB={dataB?.specs.year}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <CompareRow
                  label="Mileage"
                  valA={dataA?.specs.mileage}
                  valB={dataB?.specs.mileage}
                  icon={<Gauge className="w-4 h-4" />}
                />
                <CompareRow
                  label="Power"
                  valA={dataA?.specs.power}
                  valB={dataB?.specs.power}
                  icon={<Zap className="w-4 h-4" />}
                />
                <CompareRow
                  label="Fuel Type"
                  valA={dataA?.specs.fuel}
                  valB={dataB?.specs.fuel}
                  icon={<Fuel className="w-4 h-4" />}
                />
                <CompareRow
                  label="Engine"
                  valA={dataA?.specs.engine}
                  valB={dataB?.specs.engine}
                  icon={<CarFront className="w-4 h-4" />}
                />
                <CompareRow
                  label="Transmission"
                  valA={dataA?.specs.transmission}
                  valB={dataB?.specs.transmission}
                  icon={<GitCompare className="w-4 h-4" />}
                />
                <CompareRow
                  label="Body Type"
                  valA={dataA?.specs.bodyType}
                  valB={dataB?.specs.bodyType}
                  icon={<CarFront className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DescriptionBlock data={dataA} />
              <DescriptionBlock data={dataB} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function UrlInput({
  side,
  url,
  setUrl,
  loading,
  onSearch,
  activeData,
  error,
  color,
}: {
  side: string;
  url: string;
  setUrl: (s: string) => void;
  loading: boolean;
  onSearch: () => void;
  activeData: CarData | null;
  error: string;
  color: "indigo" | "rose";
}) {
  const isIndigo = color === "indigo";

  if (activeData) {
    return (
      <div className="flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 border border-zinc-200">
          <img
            src={activeData.images?.[0] || "/placeholder.svg"}
            className="w-full h-full object-cover"
            alt="Thumbnail"
          />
        </div>
        <div className="min-w-0 flex-1 max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isIndigo
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              Vehicle {side === "Left" ? "A" : "B"}
            </span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="font-medium text-zinc-900 truncate ">
            {activeData.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-wider text-neutral-400 w-full",
          side === "Right" ? "text-right" : "text-left"
        )}
      >
        Vehicle {side}
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1 group-focus-within:ring-2 ring-indigo-500/20 rounded-lg transition-all">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Paste listing URL..."
            disabled={loading}
            className={cn(
              "w-full bg-neutral-50 border-none text-sm px-4 py-3 rounded-lg transition-colors",
              side === "Right" ? "text-right" : "text-left"
            )}
          />
          {loading && (
            <div className="absolute right-3 top-3">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 p-2 rounded-md">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}
    </div>
  );
}

function CarHeaderCard({
  data,
  label,
  color,
}: {
  data: CarData | null;
  label: string;
  color: "indigo" | "rose";
}) {
  const [idx, setIdx] = useState(0);
  if (!data) return null;

  const images = data.images || [];
  const next = () => setIdx((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIdx((prev) => (prev - 1 + images.length) % images.length);

  const isIndigo = color === "indigo";

  return (
    <div className="flex flex-col gap-4">
      {/* Image Stage */}
      <div className="group relative aspect-4/3 rounded-3xl overflow-hidden bg-zinc-100 shadow-[0_0_16px_rgba(0,0,0,0.025)]">
        {images.length > 0 ? (
          <img
            src={images[idx]}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
            <ImageIcon className="w-12 h-12 mb-2" />
            <span className="text-sm">No Images</span>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-lg ${
              isIndigo ? "bg-indigo-600" : "bg-rose-600"
            }`}
          >
            {label}
          </span>
        </div>

        {images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full shadow-sm transition-all ${
                    i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Primary Info */}
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 leading-tight">
            {data.title}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500 font-medium">
            <MapPin className="w-4 h-4" />
            {data.location}
          </div>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-[0_0_16px_rgba(0,0,0,0.025)] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              Asking Price
            </p>
            <p className="text-2xl font-bold text-zinc-900">{data.price}</p>
          </div>
          <button
            onClick={() => window.open(`tel:${data.phoneNumber}`)}
            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  valA,
  valB,
  icon,
  highlight = false,
}: {
  label: string;
  valA?: string;
  valB?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  const emptyA = !valA || valA === "N/A";
  const emptyB = !valB || valB === "N/A";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center hover:bg-zinc-50 transition-colors py-4 px-6 group">
      <div
        className={`text-right pr-6 ${
          highlight ? "text-lg font-bold" : "text-sm font-medium"
        } ${emptyA ? "text-zinc-300" : "text-zinc-900"}`}
      >
        {emptyA ? "—" : valA}
      </div>

      <div className="flex flex-col items-center justify-center w-32 shrink-0">
        <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shadow-sm mb-1">
          {icon}
        </div>
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
          {label}
        </span>
      </div>

      <div
        className={`text-left pl-6 ${
          highlight ? "text-lg font-bold" : "text-sm font-medium"
        } ${emptyB ? "text-zinc-300" : "text-zinc-900"}`}
      >
        {emptyB ? "—" : valB}
      </div>
    </div>
  );
}

function DescriptionBlock({ data }: { data: CarData | null }) {
  if (!data) return null;
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_0_16px_rgba(0,0,0,0.025)]">
      <h4 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
        <ArrowUpRight className="w-4 h-4 text-zinc-400" />
        Seller Description
      </h4>
      <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
        {data.description || "No description provided."}
      </p>
    </div>
  );
}
