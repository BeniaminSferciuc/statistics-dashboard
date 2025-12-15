import { BentoGrid } from "@/components/bento-grid";
import { AppleChartCard } from "@/components/apple-chart-card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            România
          </h1>
          <p className="text-slate-500 mt-1">Economic Overview 2024</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Live Data via WorldBank
          </span>
        </div>
      </div>

      <BentoGrid>
        {/* 1. PIB - Cardul Principal (Mare, 2x2) - Stilul "iOS" din mijlocul pozei */}
        <div className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl transform transition-transform duration-200" />
          <div className="relative h-full bg-white dark:bg-black rounded-3xl p-0 overflow-hidden border border-transparent">
            {/* Folosim componenta noastră dar cu stil custom pt Hero */}
            <AppleChartCard
              indicatorCode="NY.GDP.MKTP.CD"
              title="Produs Intern Brut"
              subtitle="Creștere constantă în ultimul deceniu"
              color="#4f46e5" // Indigo
              unit="$"
              className="h-full border-none shadow-none"
            />
          </div>
        </div>

        {/* 2. Inflație - Card Mic (1x1) */}
        <AppleChartCard
          indicatorCode="FP.CPI.TOTL.ZG"
          title="Inflație"
          subtitle="Rata anuală"
          color="#ef4444" // Red
          unit="%"
          className="col-span-1 row-span-1"
          variant="mini"
        />

        {/* 3. Speranța de viață - Card Mic (1x1) */}
        <AppleChartCard
          indicatorCode="SP.DYN.LE00.IN"
          title="Speranța de viață"
          subtitle="Ani medie"
          color="#10b981" // Green
          unit="years"
          className="col-span-1 row-span-1"
          variant="mini"
        />

        {/* 4. Populație - Card Vertical (1x2) - Stilul "Widgets" din stanga */}
        <AppleChartCard
          indicatorCode="SP.POP.TOTL"
          title="Populație"
          subtitle="Tendință demografică"
          color="#f59e0b" // Orange
          unit="pop"
          className="col-span-1 md:col-span-1 row-span-2 bg-slate-50"
        />

        {/* 5. Șomaj - Card Lat (2x1) */}
        <AppleChartCard
          indicatorCode="SL.UEM.TOTL.ZS"
          title="Rata Șomajului"
          subtitle="% din forța de muncă"
          color="#8b5cf6" // Purple
          unit="%"
          className="col-span-1 md:col-span-2 row-span-1"
        />
        <AppleChartCard
          indicatorCode="FP.CPI.TOTL"
          title="IPC (Index)"
          subtitle="Indice Preț Consum (Ref 2010=100)"
          color="#f97316" // Orange
          unit="num" // Unitate generică numerică
          className="col-span-1 row-span-1"
          variant="mini"
        />

        {/* 3. Exporturi - Stil Widget Pătrat */}
        <AppleChartCard
          indicatorCode="NE.EXP.GNFS.CD"
          title="Exporturi"
          subtitle="Bunuri și servicii"
          color="#0ea5e9" // Sky Blue
          unit="$"
          className="col-span-1 row-span-1"
          variant="mini"
        />

        {/* 4. Investiții Străine (FDI) - Widget Vertical (Stânga sau Dreapta în grid) */}
        <AppleChartCard
          indicatorCode="BX.KLT.DINV.CD.WD"
          title="Investiții Străine"
          subtitle="Fluxuri nete (FDI)"
          color="#10b981" // Emerald
          unit="$"
          className="col-span-1 row-span-2"
        />

        {/* --- RÂNDUL 2 (Completare spații rămase) --- */}

        {/* 5. Populație - Widget Lat */}
        <AppleChartCard
          indicatorCode="SP.POP.TOTL"
          title="Populație"
          subtitle="Tendință descendentă"
          color="#ef4444" // Red
          unit="pop"
          className="col-span-1 md:col-span-2 row-span-1"
          variant="default"
        />

        {/* --- RÂNDUL 3 --- */}

        {/* 6. Rezerve Totale - Widget Lat */}
        <AppleChartCard
          indicatorCode="FI.RES.TOTL.CD"
          title="Rezerve BNR"
          subtitle="Inclusiv Aur (USD)"
          color="#eab308" // Yellow/Gold
          unit="$"
          className="col-span-1 md:col-span-2 row-span-1"
        />

        {/* 6. Card Decorativ / Static - Stilul "Hold Assist" din poza (Colt stanga jos) */}
        {/* <BentoGridItem className="col-span-1 row-span-1 bg-zinc-900 text-white border-none">
          <div className="flex flex-col justify-between h-full">
            <div className="text-xs text-zinc-400 uppercase font-bold">
              Info
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Sursa Datelor</h4>
              <p className="text-sm text-zinc-400 leading-snug">
                Datele sunt extrase în timp real prin API-ul Băncii Mondiale.
              </p>
            </div>
          </div>
        </BentoGridItem> */}
      </BentoGrid>
    </main>
  );
}
