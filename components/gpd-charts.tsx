"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// --- 1. Funcția de Fetch ---
const fetchRomaniaGDP = async () => {
  // Cerem datele pe ultimii 20 de ani
  const res = await fetch(
    "https://api.worldbank.org/v2/country/ro/indicator/NY.GDP.MKTP.CD?format=json&date=2003:2024&per_page=50"
  );
  if (!res.ok) throw new Error("Eroare la preluarea datelor");

  const data = await res.json();
  // Banca Mondială returnează un array: [metadata, date_efective]
  const rawData = data[1];

  // Procesăm datele pentru Recharts (inversăm ordinea pentru a fi cronologică)
  return rawData
    .map((item: any) => ({
      year: item.date,
      gdp: item.value, // Valoarea e în USD
    }))
    .reverse();
};

// --- 2. Configurația Chart-ului (Shadcn Style) ---
const chartConfig = {
  gdp: {
    label: "PIB (USD)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function GDPChart() {
  // --- 3. React Query ---
  const { data, isLoading, isError } = useQuery({
    queryKey: ["romania-gdp"],
    queryFn: fetchRomaniaGDP,
  });

  console.log(data);

  // Formatare numere mari (miliarde) pentru tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "USD",
      notation: "compact", // Afișează "300 mld." etc.
      maximumFractionDigits: 1,
    }).format(value);
  };

  if (isLoading)
    return <div className="p-10 text-center">Se încarcă datele...</div>;
  if (isError)
    return <div className="p-10 text-red-500">A apărut o eroare API.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evoluția PIB România</CardTitle>
        <CardDescription>
          Date anuale (2003 - 2023) - Sursa: World Bank
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // Afișăm doar anii pari sau un subset ca să nu aglomerăm axa
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Area
              dataKey="gdp"
              type="natural"
              fill="var(--color-gdp)"
              fillOpacity={0.4}
              stroke="var(--color-gdp)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
