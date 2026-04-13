import React, { useRef, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface BarChartProps {
  labels: string[];
  data: number[];
  label?: string;
  height?: number;
  className?: string;
}

/**
 * StatsBarChart — High-fidelity, animated spiritual activity chart.
 */
export const StatsBarChart: React.FC<BarChartProps> = ({
  labels,
  data,
  label = "Zikr",
  height = 220,
  className = "",
}) => {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  // ── Options with Premium Animations ────────────────────────────────────────
  const options: ChartOptions<"bar"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 20 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15, 15, 20, 0.85)",
        backdropFilter: "blur(12px)",
        padding: 16,
        titleFont: { size: 14, weight: "bold", family: "inherit" },
        bodyFont: { size: 13, family: "inherit" },
        cornerRadius: 16,
        displayColors: false,
        caretSize: 6,
        caretPadding: 0,
        yAlign: "center", // Anchor directly to the head
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { 
          color: "rgba(var(--color-base-content-raw, 100 100 100) / 0.4)",
          font: { size: 12, family: "inherit", weight: 500 },
          padding: 10,
        },
      },
      y: {
        display: false, // Clean look
        beginAtZero: true,
      },
    },
    // 🎨 Staggered "Growth" Animation
    animations: {
      y: {
        duration: 2000,
        easing: "easeOutElastic",
        from: (ctx) => (ctx.type === "data" ? ctx.chart.chartArea.bottom : undefined),
        delay: (ctx) => ctx.dataIndex * 150, // This creates the staggered "pop" effect
      },
      opacity: {
        duration: 1000,
        from: 0,
        to: 1,
      }
    },
    hover: {
      mode: "index",
      intersect: false,
    },
  }), []);

  // ── Data with Refined Gradients ─────────────────────────────────────────────
  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "";
          
          const style = window.getComputedStyle(document.documentElement);
          const primary = style.getPropertyValue("--color-primary").trim() || "#7c3aed";
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0)"); // Pure transparent
          gradient.addColorStop(1, primary || "#7c3aed");     // Pure theme primary
          return gradient;
        },
        hoverBackgroundColor: () => {
          const style = window.getComputedStyle(document.documentElement);
          return style.getPropertyValue("--color-primary").trim() || "#7c3aed";
        },
        borderRadius: 30, // Fully rounded caps
        borderSkipped: false,
        barThickness: 24, // Thicker for better touch targets
        maxBarThickness: 32,
      },
    ],
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Subtle background glow behind the bars */}
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent pointer-events-none" />
      
      <Bar 
        key={`chart-${labels.join("-")}`} // Forces re-render on data change to prevent canvas reuse errors
        ref={chartRef} 
        options={options} 
        data={chartData} 
      />
    </div>
  );
};
