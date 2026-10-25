import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatINR(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function GoldHistorySummary({ refreshKey = 0 }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/api/history/gold`);

        if (!cancelled) {
          const rows = (response.data.history || [])
            .filter(
              (item) => item.date && Number.isFinite(Number(item.gold24K)),
            )
            .sort((a, b) => a.date.localeCompare(b.date));

          setHistory(rows);

          if (rows.length < 2) {
            setError("Not enough historical records to compare.");
          }
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Unable to load historical price changes.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-5">
        <p className="text-sm text-stone-500">Loading historical summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white p-5">
        <p className="text-sm text-stone-500">{error}</p>
      </div>
    );
  }

  const first = history[0];
  const last = history[history.length - 1];

  const change = Number(last.gold24K) - Number(first.gold24K);
  const percent = (change / Number(first.gold24K)) * 100;

  const Icon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;

  const movementColor =
    change > 0
      ? "text-emerald-700"
      : change < 0
        ? "text-red-600"
        : "text-stone-500";

  return (
    <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
        Historical overview
      </p>

      <h3 className="mt-2 text-xl font-extrabold text-[#2B2013]">
        24K Gold Price Change
      </h3>

      <p className="mt-1 text-sm text-stone-500">
        {first.date} to {last.date} · {history.length} available records
      </p>

      <div className={`mt-5 flex items-center gap-3 ${movementColor}`}>
        <Icon size={26} />

        <div>
          <p className="text-2xl font-extrabold">
            {change > 0 ? "+" : ""}
            {formatINR(change)}
          </p>

          <p className="text-sm font-semibold">
            {change > 0 ? "+" : ""}
            {percent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#FFFCF5] p-3">
          <p className="text-xs text-stone-500">Starting price</p>
          <p className="mt-1 font-bold text-stone-800">
            {formatINR(first.gold24K)}
          </p>
        </div>

        <div className="rounded-xl bg-[#FFFCF5] p-3">
          <p className="text-xs text-stone-500">Ending price</p>
          <p className="mt-1 font-bold text-stone-800">
            {formatINR(last.gold24K)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-stone-400">
        Change is calculated between the first and last available historical
        records, not necessarily the previous calendar day.
      </p>
    </section>
  );
}

export default GoldHistorySummary;
