"use client";

import { Portfolio, TradesDay } from "@/lib/types";
import { TrendingUp, TrendingDown, Wallet, DollarSign, Zap } from "lucide-react";

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="glass rounded-2xl p-5 glow-purple hover:bg-white/[0.06] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</p>
      {subtext && (
        <p
          className={`text-sm mt-1 font-medium ${
            trend === "up"
              ? "text-emerald-400"
              : trend === "down"
              ? "text-red-400"
              : "text-muted-foreground"
          }`}
        >
          {trend === "up" && "↑ "}
          {trend === "down" && "↓ "}
          {subtext}
        </p>
      )}
    </div>
  );
}

export function Hero({
  portfolio,
  trades,
}: {
  portfolio: Portfolio;
  trades: TradesDay;
}) {
  const totalValue =
    portfolio.summary.portfolio_value + portfolio.summary.cash_remaining;
  const totalPnl =
    portfolio.summary.total_pnl + trades.summary.final_results.realized_pnl;
  const pnlPct = ((totalPnl / portfolio.meta.initial_balance) * 100).toFixed(2);
  const winRate = Math.round(
    (trades.summary.final_results.wins / trades.summary.final_results.resolved) * 100
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="gradient-text">Polymarket</span> Paper Trading
          </h1>
          <p className="text-muted-foreground mt-1">
            {portfolio.meta.strategy.substring(0, 80)}...
          </p>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-muted-foreground">
            Updated {new Date(portfolio.last_updated).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Value"
          value={`$${totalValue.toFixed(2)}`}
          subtext={`of $${portfolio.meta.initial_balance.toFixed(0)} initial`}
          icon={DollarSign}
          trend="neutral"
        />
        <StatCard
          label="Total P&L"
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`}
          subtext={`${totalPnl >= 0 ? "+" : ""}${pnlPct}%`}
          icon={totalPnl >= 0 ? TrendingUp : TrendingDown}
          trend={totalPnl >= 0 ? "up" : "down"}
        />
        <StatCard
          label="Cash Available"
          value={`$${portfolio.summary.cash_remaining.toFixed(2)}`}
          subtext={`${((portfolio.summary.cash_remaining / portfolio.meta.initial_balance) * 100).toFixed(0)}% of capital`}
          icon={Wallet}
          trend="neutral"
        />
        <StatCard
          label="Day Trades"
          value={`${winRate}% WR`}
          subtext={`${trades.summary.final_results.wins}W / ${trades.summary.final_results.losses}L / ${trades.summary.final_results.pending}P`}
          icon={Zap}
          trend={winRate > 50 ? "up" : "down"}
        />
      </div>
    </div>
  );
}
