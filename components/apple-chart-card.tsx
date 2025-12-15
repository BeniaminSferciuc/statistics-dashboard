"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { BentoGridItem } from "./bento-grid";

interface AppleChartProps {
  indicatorCode: string;
  title: string;
  subtitle?: string;
  color: string; // ex: "#0ea5e9" (Tailwind colors)
  className?: string; // Pentru a controla cât spațiu ocupă în grid (col-span-2 etc)
  variant?: "default" | "mini" | "gradient"; // Stiluri diferite
  unit?: "$" | "%" | "pop" | "years" | "num";
}

// Funcția de fetch rămâne aceeași
const fetchData = async (code: string) => {
  const res = await fetch(
    `https://api.worldbank.org/v2/country/ro/indicator/${code}?format=json&date=2010:2023&per_page=50`
  );
  if (!res.ok) throw new Error("Err");
  const data = await res.json();
  if (!data[1]) return [];
  return data[1]
    .map((item: any) => ({ year: item.date, value: item.value }))
    .filter((item: any) => item.value !== null)
    .reverse();
};

export function AppleChartCard({
  indicatorCode,
  title,
  subtitle,
  color,
  className,
  variant = "default",
  unit,
}: AppleChartProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["wb-data", indicatorCode],
    queryFn: () => fetchData(indicatorCode),
  });

  // Calculăm ultima valoare pentru a o afișa mare (KPI)
  const lastValue = data && data.length > 0 ? data[data.length - 1].value : 0;
  const prevValue = data && data.length > 1 ? data[data.length - 2].value : 0;
  const isGrowing = lastValue >= prevValue;

  // Formatare
  const formatVal = (val: number) => {
    if (unit === "$")
      return new Intl.NumberFormat("ro-RO", {
        notation: "compact",
        style: "currency",
        currency: "USD",
      }).format(val);
    if (unit === "%") return val.toFixed(1) + "%";
    if (unit === "pop")
      return new Intl.NumberFormat("ro-RO", { notation: "compact" }).format(
        val
      );

    // Pentru IPC (Index simplu)
    if (unit === "num") return val.toFixed(1);

    return val.toLocaleString("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Loading state minimalist
  if (isLoading)
    return (
      <BentoGridItem className={className}>
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </BentoGridItem>
    );

  return (
    <BentoGridItem className={`${className} relative overflow-hidden`}>
      {/* Header Card */}
      <div className="z-10 flex flex-col items-start justify-between h-full">
        <div className="w-full">
          {/* Titlu mic și gri - stil Apple */}
          <div className="flex items-center gap-2 mb-1">
            <div
              className="p-1.5 rounded-full"
              style={{ backgroundColor: `${color}20` }}
            >
              <Activity size={14} style={{ color: color }} />
            </div>
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          </div>

          {/* Valoarea Mare (KPI) */}
          <div className="flex items-end gap-2 mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatVal(lastValue)}
            </span>
            {variant !== "mini" && (
              <span
                className={`text-sm font-medium mb-1 flex items-center ${isGrowing ? "text-green-500" : "text-red-500"}`}
              >
                {isGrowing ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {/* Graficul - Poziționat absolut în partea de jos sau integrat */}
        <div className="w-full h-[100px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id={`gradient-${indicatorCode}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                fill={`url(#gradient-${indicatorCode})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BentoGridItem>
  );
}
