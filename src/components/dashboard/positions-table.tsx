"use client";

import { Position } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const categoryColors: Record<string, string> = {
  Geopolitics: "bg-red-500/15 text-red-400 border-red-500/20",
  Politics: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  AI: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Macro: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Fun: "bg-pink-500/15 text-pink-400 border-pink-500/20",
};

function ThesisRow({ thesis }: { thesis: string }) {
  return (
    <TableRow className="border-b border-white/[0.04] bg-white/[0.02]">
      <TableCell colSpan={7} className="py-3 px-6">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {thesis}
        </p>
      </TableCell>
    </TableRow>
  );
}

export function PositionsTable({ positions }: { positions: Position[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="glass-strong rounded-2xl overflow-hidden glow-purple">
      <div className="p-5 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Open Positions</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {positions.length} active markets
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            ${positions.reduce((s, p) => s + p.cost, 0).toFixed(2)} invested
          </Badge>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Market</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium text-center">Side</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Entry</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Current</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">P&L</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Resolves</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => (
              <>
                <TableRow
                  key={pos.id}
                  className="border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-colors"
                  onClick={() =>
                    setExpandedId(expandedId === pos.id ? null : pos.id)
                  }
                >
                  <TableCell className="font-medium max-w-[260px]">
                    <div className="flex items-center gap-2">
                      {expandedId === pos.id ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate">{pos.market}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${categoryColors[pos.category] ?? ""}`}
                    >
                      {pos.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-xs font-bold ${
                        pos.side === "YES"
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                      }`}
                    >
                      {pos.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {pos.entry_price.toFixed(2)}¢
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {pos.current_price.toFixed(2)}¢
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        pos.pnl > 0
                          ? "text-emerald-400"
                          : pos.pnl < 0
                          ? "text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(pos.resolution_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: pos.resolution_date.startsWith("2028") ? "numeric" : undefined,
                    })}
                  </TableCell>
                </TableRow>
                {expandedId === pos.id && <ThesisRow key={`thesis-${pos.id}`} thesis={pos.thesis} />}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
