"use client";

import { Trade } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const resultStyles: Record<string, string> = {
  WIN: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  LOSS: "bg-red-500/15 text-red-400 border-red-500/20",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20 animate-pulse",
};

export function TradesTable({
  trades,
  realizedPnl,
}: {
  trades: Trade[];
  realizedPnl: number;
}) {
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Short-Term Trades</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Day 1 bets — Feb 24
            </p>
          </div>
          <Badge
            variant="outline"
            className={`font-mono ${
              realizedPnl >= 0
                ? "border-emerald-500/30 text-emerald-400"
                : "border-red-500/30 text-red-400"
            }`}
          >
            {realizedPnl >= 0 ? "+" : ""}${realizedPnl.toFixed(2)} realized
          </Badge>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Market</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Side</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Cost</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">P&L</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow
                key={trade.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors"
              >
                <TableCell className="font-medium max-w-[300px]">
                  <div className="truncate">{trade.market}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {trade.resolution_note}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`text-xs font-bold ${
                      trade.side === "YES"
                        ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                    }`}
                  >
                    {trade.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  ${trade.cost.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-mono text-sm font-semibold ${
                      trade.pnl === null
                        ? "text-amber-400"
                        : trade.pnl >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {trade.pnl === null
                      ? "—"
                      : `${trade.pnl >= 0 ? "+" : ""}$${trade.pnl.toFixed(2)}`}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold ${resultStyles[trade.result]}`}
                  >
                    {trade.result}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
