"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  Gauge,
  MapPin,
  Settings2,
  Phone,
  ArrowUpRight,
  Car,
  Zap,
  RefreshCw,
  Plus,
  Loader2,
  Info,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Cog,
  Droplets,
} from "lucide-react";
import React from "react";

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

export default function AppleDashboard() {
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
    <div className="min-h-screen bg-[#F5f5f7] text-[#1D1D1F] antialiased">
      <header className="sticky top-0 z-50 bg-[#FBFBFD]/80 backdrop-blur-2xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-linear-to-br from-[#1D1D1F] to-[#424245] text-white rounded-[10px] flex items-center justify-center font-semibold text-[11px] tracking-tight shadow-sm">
              CP
            </div>
            <span className="font-semibold text-[15px] tracking-[-0.01em]">
              Comparator Pro
            </span>
          </div>

          <div className="flex items-center gap-3">
            {hasData && (
              <button
                onClick={handleReset}
                className="text-[13px] font-medium text-[#424245] hover:text-[#1D1D1F] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center text-[11px] font-semibold text-white shadow-sm">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-[40px] font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-2">
            Compare Vehicles
          </h1>
          <p className="text-[17px] text-[#86868B] font-normal">
            Side-by-side analysis to find your perfect match
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <InputCard
            label="Vehicle A"
            url={urlA}
            setUrl={setUrlA}
            onSearch={() => fetchCar(urlA, "A")}
            loading={loadingA}
            error={errorA}
            hasData={!!dataA}
            activeData={dataA}
          />
          <InputCard
            label="Vehicle B"
            url={urlB}
            setUrl={setUrlB}
            onSearch={() => fetchCar(urlB, "B")}
            loading={loadingB}
            error={errorB}
            hasData={!!dataB}
            activeData={dataB}
          />
        </div>

        {hasData ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VehicleCard data={dataA} label="A" color="#007AFF" />
              <VehicleCard data={dataB} label="B" color="#34C759" />
            </div>

            <div className="bg-white rounded-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-black/4 overflow-hidden">
              <div className="px-6 py-5 border-b border-black/4 flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1D1D1F]">
                    Technical Specifications
                  </h3>
                  <p className="text-[13px] text-[#86868B] mt-0.5">
                    Detailed comparison of key metrics
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-[#86868B]" />
                </div>
              </div>

              <div className="grid grid-cols-12 border-b border-black/4 bg-[#FAFAFA]">
                <div className="col-span-4 py-3 px-6">
                  <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wide">
                    Specification
                  </span>
                </div>
                <div className="col-span-4 py-3 px-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#007AFF]" />
                  <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wide">
                    Vehicle A
                  </span>
                </div>
                <div className="col-span-4 py-3 px-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#34C759]" />
                  <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wide">
                    Vehicle B
                  </span>
                </div>
              </div>

              <div className="divide-y divide-black/4">
                <SpecRow
                  icon={<DollarSign />}
                  iconBg="bg-[#34C759]/10"
                  iconColor="text-[#34C759]"
                  label="Price"
                  valA={dataA?.price}
                  valB={dataB?.price}
                  highlight
                />
                <SpecRow
                  icon={<Calendar />}
                  iconBg="bg-[#007AFF]/10"
                  iconColor="text-[#007AFF]"
                  label="Year"
                  valA={dataA?.specs.year}
                  valB={dataB?.specs.year}
                />
                <SpecRow
                  icon={<Gauge />}
                  iconBg="bg-[#AF52DE]/10"
                  iconColor="text-[#AF52DE]"
                  label="Mileage"
                  valA={dataA?.specs.mileage}
                  valB={dataB?.specs.mileage}
                />
                <SpecRow
                  icon={<Zap />}
                  iconBg="bg-[#FF9500]/10"
                  iconColor="text-[#FF9500]"
                  label="Power"
                  valA={dataA?.specs.power}
                  valB={dataB?.specs.power}
                />
                <SpecRow
                  icon={<Cog />}
                  iconBg="bg-[#636366]/10"
                  iconColor="text-[#636366]"
                  label="Engine"
                  valA={dataA?.specs.engine}
                  valB={dataB?.specs.engine}
                />
                <SpecRow
                  icon={<Droplets />}
                  iconBg="bg-[#FF3B30]/10"
                  iconColor="text-[#FF3B30]"
                  label="Fuel"
                  valA={dataA?.specs.fuel}
                  valB={dataB?.specs.fuel}
                />
                <SpecRow
                  icon={<Settings2 />}
                  iconBg="bg-[#5856D6]/10"
                  iconColor="text-[#5856D6]"
                  label="Transmission"
                  valA={dataA?.specs.transmission}
                  valB={dataB?.specs.transmission}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DescriptionCard
                label="Vehicle A"
                description={dataA?.description}
                color="#007AFF"
              />
              <DescriptionCard
                label="Vehicle B"
                description={dataB?.description}
                color="#34C759"
              />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

function InputCard({
  label,
  url,
  setUrl,
  onSearch,
  loading,
  error,
  hasData,
  activeData,
}: {
  label: string;
  url: string;
  setUrl: (url: string) => void;
  onSearch: () => void;
  loading: boolean;
  error: string;
  hasData: boolean;
  activeData: CarData | null;
}) {
  if (hasData && activeData) {
    return (
      <div className="bg-white rounded-2xl border border-black/4 p-4 flex items-center gap-4 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="w-14 h-14 rounded-xl bg-[#F5F5F7] overflow-hidden shrink-0">
          {activeData.images?.[0] ? (
            <img
              src={activeData.images[0] || "/placeholder.svg"}
              className="w-full h-full object-cover"
              alt={activeData.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-6 h-6 text-[#86868B]" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wide">
              {label}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
          </div>
          <p className="font-semibold text-[15px] text-[#1D1D1F] truncate leading-tight">
            {activeData.title}
          </p>
          <p className="text-[13px] text-[#007AFF] font-medium mt-0.5">
            {activeData.price}
          </p>
        </div>
        <button
          onClick={() => window.open(url, "_blank")}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F5F7] rounded-full text-[#86868B] hover:text-[#1D1D1F] transition-colors"
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/4 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden focus-within:ring-2 focus-within:ring-[#007AFF]/20 focus-within:border-[#007AFF]/30 transition-all">
      <div className="relative flex items-center h-14 px-4">
        <div className="text-[#86868B] mr-3">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#007AFF]" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={`Paste ${label} URL...`}
          className="flex-1 bg-transparent outline-none text-[#1D1D1F] text-[15px] placeholder:text-[#86868B]"
        />
        <button
          onClick={onSearch}
          disabled={loading || !url}
          className="bg-[#007AFF] text-white px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-[#0066CC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Fetch
        </button>
      </div>
      {error && (
        <div className="px-4 pb-3 text-[13px] text-[#FF3B30] flex items-center gap-1.5">
          <Info className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
}

function VehicleCard({
  data,
  label,
  color,
}: {
  data: CarData | null;
  label: string;
  color: string;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  if (!data) {
    return (
      <div className="bg-white rounded-[20px] border border-black/4 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-[480px] flex flex-col items-center justify-center text-[#86868B]">
        <div className="w-20 h-20 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-5">
          <Plus className="w-8 h-8 text-[#C7C7CC]" />
        </div>
        <span className="font-semibold text-[17px] text-[#1D1D1F] mb-1">
          Add Vehicle {label}
        </span>
        <span className="text-[15px] text-[#86868B]">
          Paste a URL above to begin
        </span>
      </div>
    );
  }

  const images = data.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white rounded-[20px] border border-black/4 shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="relative h-64 bg-[#F5F5F7] group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage] || "/placeholder.svg"}
              className="w-full h-full object-cover transition-opacity duration-300"
              alt={data.title}
            />
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1D1D1F]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5 text-[#1D1D1F]" />
                </button>
              </>
            )}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-1.5 items-center">
                {images.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImage ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
                {images.length > 5 && (
                  <span className="text-[10px] text-white/80 ml-1">
                    +{images.length - 5}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-[#D1D1D6]" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-lg"
            style={{ backgroundColor: color }}
          >
            {label}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#1D1D1F] shadow-lg flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {data.location}
          </span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="px-4 py-3 bg-[#FAFAFA] border-b border-black/4 overflow-x-auto">
          <div className="flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                  idx === currentImage
                    ? "ring-2 ring-[#007AFF] ring-offset-1"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-6">
        <h2 className="text-[20px] font-semibold text-[#1D1D1F] leading-tight mb-2 line-clamp-2">
          {data.title}
        </h2>

        {data.phoneNumber && (
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868B] mb-4">
            <Phone className="w-3.5 h-3.5" />
            {data.phoneNumber}
          </div>
        )}

        <div className="pt-4 border-t border-black/4">
          <p className="text-[11px] uppercase font-semibold text-[#86868B] tracking-wide mb-1">
            Asking Price
          </p>
          <p className="text-[32px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">
            {data.price}
          </p>
        </div>
      </div>
    </div>
  );
}

function SpecRow({
  icon,
  iconBg,
  iconColor,
  label,
  valA,
  valB,
  highlight,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  valA?: string;
  valB?: string;
  highlight?: boolean;
}) {
  const emptyA = !valA || valA === "N/A";
  const emptyB = !valB || valB === "N/A";

  return (
    <div className="grid grid-cols-12 hover:bg-[#F5F5F7]/50 transition-colors">
      <div className="col-span-4 py-4 px-6 flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}
        >
          {React.cloneElement(icon as React.ReactElement)}
        </div>
        <span className="text-[13px] font-medium text-[#1D1D1F]">{label}</span>
      </div>
      <div
        className={`col-span-4 py-4 px-6 flex items-center ${
          highlight ? "text-[20px] font-semibold" : "text-[15px] font-medium"
        } ${emptyA ? "text-[#C7C7CC]" : "text-[#1D1D1F]"}`}
      >
        {emptyA ? "—" : valA}
      </div>
      <div
        className={`col-span-4 py-4 px-6 flex items-center ${
          highlight ? "text-[20px] font-semibold" : "text-[15px] font-medium"
        } ${emptyB ? "text-[#C7C7CC]" : "text-[#1D1D1F]"}`}
      >
        {emptyB ? "—" : valB}
      </div>
    </div>
  );
}

function DescriptionCard({
  label,
  description,
  color,
}: {
  label: string;
  description?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-black/4 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h4 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wide">
          {label} Description
        </h4>
      </div>
      <p className="text-[15px] text-[#424245] leading-relaxed whitespace-pre-line line-clamp-8">
        {description || "No description available."}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-72 bg-white rounded-[20px] border border-dashed border-[#D1D1D6] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mb-4">
            <Car className="w-8 h-8 text-[#C7C7CC]" />
          </div>
          <span className="text-[15px] font-medium text-[#86868B]">
            Vehicle Cards
          </span>
          <span className="text-[13px] text-[#C7C7CC] mt-1">
            Add URLs to compare
          </span>
        </div>
        <div className="h-72 bg-white rounded-[20px] border border-dashed border-[#D1D1D6] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-[#C7C7CC]" />
          </div>
          <span className="text-[15px] font-medium text-[#86868B]">
            Specifications
          </span>
          <span className="text-[13px] text-[#C7C7CC] mt-1">
            Side-by-side metrics
          </span>
        </div>
        <div className="h-72 bg-white rounded-[20px] border border-dashed border-[#D1D1D6] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mb-4">
            <Settings2 className="w-8 h-8 text-[#C7C7CC]" />
          </div>
          <span className="text-[15px] font-medium text-[#86868B]">
            Details
          </span>
          <span className="text-[13px] text-[#C7C7CC] mt-1">
            Full descriptions
          </span>
        </div>
      </div>
    </div>
  );
}

function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
