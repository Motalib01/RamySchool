import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

type DataPoint = {
  name: string;
  value: number;
  [k: string]: any;
};

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  data: DataPoint[];
  dataKey?: string; 
  height?: number; 
  stroke?: string; 
  fill?: string; 
  className?: string;
}

export default function ChartCard({
  title = "Chart",
  subtitle,
  data,
  dataKey = "value",
  height = 160,
  stroke = "#10B981", 
  fill = "rgba(16,185,129,0.12)",
  className,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-4 shadow-sm",
        "flex flex-col gap-3",
        className
      )}
    >
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stroke} stopOpacity={0.18} />
                <stop offset="95%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: 8 }}
              formatter={(value: any) =>
                typeof value === "number" ? value.toLocaleString() : value
              }
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              fill="url(#gradientFill)"
              strokeWidth={2}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
