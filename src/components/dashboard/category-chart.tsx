"use client";

import { Position } from "@/lib/types";
import { useState } from "react";

const COLORS = [
  "hsl(0, 72%, 55%)",     // Geopolitics - red
  "hsl(220, 70%, 55%)",   // Politics - blue
  "hsl(262, 83%, 68%)",   // AI - violet
  "hsl(38, 92%, 50%)",    // Macro - amber
  "hsl(330, 75%, 60%)",   // Fun - pink
];

interface CategoryData {
  name: string;
  value: number;
  count: number;
  pnl: number;
  percent: number;
}

function aggregateByCategory(positions: Position[]): CategoryData[] {
  const map = new Map<string, Omit<CategoryData, "percent">>();
  let total = 0;
  for (const pos of positions) {
    total += pos.cost;
    const existing = map.get(pos.category);
    if (existing) {
      existing.value += pos.cost;
      existing.count += 1;
      existing.pnl += pos.pnl;
    } else {
      map.set(pos.category, {
        name: pos.category,
        value: pos.cost,
        count: 1,
        pnl: pos.pnl,
      });
    }
  }
  return Array.from(map.values()).map((d) => ({
    ...d,
    percent: total > 0 ? (d.value / total) * 100 : 0,
  }));
}

function buildConicGradient(data: CategoryData[]): string {
  const segments: string[] = [];
  let cursor = 0;
  for (let i = 0; i < data.length; i++) {
    const start = cursor;
    const end = cursor + data[i].percent * 3.6; // percent to degrees
    segments.push(`${COLORS[i % COLORS.length]} ${start}deg ${end}deg`);
    cursor = end;
  }
  return `conic-gradient(${segments.join(", ")})`;
}

export function CategoryChart({ positions }: { positions: Position[] }) {
  const data = aggregateByCategory(positions);
  const [hovered, setHovered] = useState<number | null>(null);
  const totalInvested = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-strong rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-1">Categories</h2>
      <p className="text-sm text-muted-foreground mb-4">Allocation by category</p>

      {/* Donut chart */}
      <div className="relative mx-auto mb-4" style={{ width: 180, height: 180 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: buildConicGradient(data),
            mask: "radial-gradient(circle, transparent 54%, black 55%)",
            WebkitMask: "radial-gradient(circle, transparent 54%, black 55%)",
          }}
        />

        {/* Invisible hover segments */}
        {data.map((cat, i) => {
          const startPercent = data.slice(0, i).reduce((s, d) => s + d.percent, 0);
          const midAngle = ((startPercent + cat.percent / 2) / 100) * 360 - 90;
          const rad = (midAngle * Math.PI) / 180;
          // Place an invisible hover target at the midpoint of each arc
          const cx = 90 + Math.cos(rad) * 65;
          const cy = 90 + Math.sin(rad) * 65;
          return (
            <div
              key={cat.name}
              className="absolute rounded-full"
              style={{
                width: 40,
                height: 40,
                left: cx - 20,
                top: cy - 20,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hovered !== null ? (
            <>
              <span className="text-xs text-muted-foreground">{data[hovered].name}</span>
              <span className="text-lg font-bold font-mono">${data[hovered].value.toFixed(0)}</span>
              <span
                className={`text-xs font-mono font-semibold ${
                  data[hovered].pnl >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {data[hovered].pnl >= 0 ? "+" : ""}${data[hovered].pnl.toFixed(2)}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-lg font-bold font-mono">${totalInvested.toFixed(0)}</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map((cat, i) => (
          <div
            key={cat.name}
            className="flex items-center justify-between text-sm"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span>{cat.name}</span>
              <span className="text-muted-foreground text-xs">{cat.percent.toFixed(0)}%</span>
            </div>
            <span className="font-mono text-muted-foreground">
              ${cat.value.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
