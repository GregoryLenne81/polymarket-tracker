import { Hero } from "@/components/dashboard/hero";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { TradesTable } from "@/components/dashboard/trades-table";
import { CategoryChart } from "@/components/dashboard/category-chart";
import type { Portfolio, TradesDay } from "@/lib/types";
import portfolioData from "../../data/portfolio.json";
import tradesData from "../../data/trades-day1.json";

export default function DashboardPage() {
  const portfolio = portfolioData as Portfolio;
  const trades = tradesData as TradesDay;

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/[0.08] rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/[0.06] rounded-full blur-[128px]" />
      </div>

      <Hero portfolio={portfolio} trades={trades} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PositionsTable positions={portfolio.positions} />
        </div>
        <div>
          <CategoryChart positions={portfolio.positions} />
        </div>
      </div>

      <TradesTable
        trades={trades.trades}
        realizedPnl={trades.summary.final_results.realized_pnl}
      />

      <footer className="mt-12 pb-8 text-center text-sm text-muted-foreground">
        <p>
          Paper Trading Sim · Not real money · Data from{" "}
          <a
            href="https://polymarket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Polymarket
          </a>
        </p>
      </footer>
    </main>
  );
}
