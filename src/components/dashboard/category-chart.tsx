"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Position } from "@/lib/types";
import { useState, useEffect } from "react";

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
}

function aggregateByCategory(positions: Position[]): CategoryData[] {
  const map = new Map<string, CategoryData>();
  for (const pos of positions) {
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
  return Array.from(map.values());
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryData }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-strong rounded-lg p-3 text-sm">
      <p className="font-semibold">{data.name}</p>
      <p className="text-muted-foreground">
        ${data.value.toFixed(2)} invested · {data.count} position{data.count > 1 ? "s" : ""}
      </p>
      <p
        className={`font-mono font-semibold ${
          data.pnl >= 0 ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {data.pnl >= 0 ? "+" : ""}${data.pnl.toFixed(2)} P&L
      </p>
    </div>
  );
}

export function CategoryChart({ positions }: { positions: Position[] }) {
  const data = aggregateByCategory(positions);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="glass-strong rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-1">Categories</h2>
      <p className="text-sm text-muted-foreground mb-4">Allocation by category</p>
      <div className="h-[220px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="space-y-2 mt-2">
        {data.map((cat, i) => (
          <div key={cat.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span>{cat.name}</span>
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
