import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PURITIES = {
  gold24K: "24K Gold",
  gold22K: "22K Gold",
  gold18K: "18K Gold",
};

function formatPrice(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}

function GoldHistoryChart({ refreshKey = 0 }) {
  const [history, setHistory] = useState([]);
  const [purity, setPurity] = useState("gold24K");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/api/history/gold`, {
          timeout: 20000,
        });

        if (cancelled) return;

        const rows = Array.isArray(response.data.history)
          ? response.data.history
          : [];

        const validRows = rows
          .filter(
            (item) =>
              item.date &&
              Number.isFinite(Number(item[purity] ?? item.gold24K)),
          )
          .sort((a, b) => a.date.localeCompare(b.date));

        setHistory(validRows);
        setSource(response.data.source || "Gold price API");
        setLastChecked(new Date());

        if (validRows.length === 0) {
          setError(
            "Historical prices are not available from the provider yet.",
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Gold history error:", err.response?.data || err.message);

        setError(
          err.response?.data?.message ||
            "Unable to load gold history. Please try again.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const selectedPrices = history.map((item) => {
    const value = item[purity];

    // Support a backend response that only contains 24K prices.
    if (value !== undefined && value !== null) {
      return Number(value);
    }

    const basePrice = Number(item.gold24K);

    if (purity === "gold22K") {
      return Number(((basePrice * 22) / 24).toFixed(2));
    }

    if (purity === "gold18K") {
      return Number(((basePrice * 18) / 24).toFixed(2));
    }

    return basePrice;
  });

  const firstPrice = selectedPrices[0];
  const lastPrice = selectedPrices[selectedPrices.length - 1];

  const priceChange =
    selectedPrices.length >= 2 ? lastPrice - firstPrice : null;

  const changePercent =
    priceChange !== null && firstPrice !== 0
      ? (priceChange / firstPrice) * 100
      : null;

  const chartData = {
    labels: history.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: `${PURITIES[purity]} · ₹/gram`,
        data: selectedPrices,
        borderColor: "#B8860B",
        backgroundColor: "rgba(234, 179, 8, 0.13)",
        pointBackgroundColor: "#D4A017",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#2B2013",
        titleColor: "#FDE68A",
        bodyColor: "#FFFFFF",
        padding: 12,
        callbacks: {
          label: (context) => ` ${formatPrice(context.raw)} per gram`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#8C8172",
          maxRotation: 0,
          autoSkip: true,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(120, 90, 40, 0.10)",
        },
        ticks: {
          color: "#8C8172",
          callback: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <section className="rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-[0_12px_40px_rgba(91,65,20,0.06)] sm:p-7">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            <TrendingUp size={16} />
            Price history
          </div>

          <h2 className="mt-2 text-xl font-extrabold text-[#2B2013] sm:text-2xl">
            Gold price trend
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Last 7 days · Indian rupees per gram
          </p>
        </div>

        <select
          value={purity}
          onChange={(event) => setPurity(event.target.value)}
          className="rounded-xl border border-amber-200 bg-[#FFFCF5] px-3 py-2.5 text-sm font-semibold text-[#6B4D12] outline-none focus:border-amber-500"
          aria-label="Select gold purity"
        >
          {Object.entries(PURITIES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Price change summary */}
      {!loading && !error && history.length >= 2 && (
        <div className="mt-6 rounded-2xl bg-[#FFFCF5] p-4">
          <p className="text-sm text-stone-500">Change across available data</p>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span
              className={`text-2xl font-extrabold ${
                priceChange > 0
                  ? "text-emerald-700"
                  : priceChange < 0
                    ? "text-red-600"
                    : "text-stone-700"
              }`}
            >
              {priceChange > 0 ? "+" : ""}
              {formatPrice(priceChange)}
            </span>

            <span
              className={`text-sm font-semibold ${
                priceChange > 0
                  ? "text-emerald-700"
                  : priceChange < 0
                    ? "text-red-600"
                    : "text-stone-500"
              }`}
            >
              ({changePercent > 0 ? "+" : ""}
              {changePercent?.toFixed(2)}%)
            </span>
          </div>

          <p className="mt-1 text-xs text-stone-500">
            From {formatPrice(firstPrice)} to {formatPrice(lastPrice)}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="mt-6">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-stone-500">
            <RefreshCw size={24} className="animate-spin text-amber-600" />
            <p className="text-sm">Loading historical prices...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl bg-[#FFFCF5] px-5 text-center">
            <AlertCircle size={28} className="text-amber-700" />

            <p className="max-w-sm text-sm text-stone-600">{error}</p>

            <p className="max-w-sm text-xs text-stone-400">
              The chart requires real dated price records from the history API.
              It will not generate artificial prices.
            </p>
          </div>
        ) : (
          <div className="h-64 sm:h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-amber-100 pt-4">
        <p className="text-xs text-stone-400">
          Source: {source || "Gold price API"}
        </p>

        <p className="text-xs text-stone-400">
          {lastChecked
            ? `Checked ${lastChecked.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Not checked yet"}
        </p>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-stone-400">
        Historical spot-price estimates. INR conversions using a current
        exchange rate may differ from actual historical INR rates. Jewellery
        premiums, taxes, and making charges are excluded.
      </p>
    </section>
  );
}

export default GoldHistoryChart;
