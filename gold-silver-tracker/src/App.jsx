
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react";
import {
  Coins,
  CircleDollarSign,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Header from "./components/Header.jsx";
import PriceCard from "./components/PriceCard.jsx";
import GoldHistoryChart from "./components/GoldHistoryChart.jsx";
import PriceCalculator from "./components/PriceCalculator.jsx";
import GoldHistorySummary from "./components/GoldHistorySummary.jsx";
import PriceChange from "./components/PriceChange.jsx";
import Footer from "./components/Footer.jsx";
import Loader from "./components/Loader.jsx";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function App() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const getPrices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/api/prices`, {
        timeout: 15000,
      });

      setPrices(response.data);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      console.error("Price loading error:", err);

      setError(
        err.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : "Unable to load prices. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPrices();
  }, [getPrices]);

  function formatPrice(value) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) {
      return "Unavailable";
    }

    return `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  const gold = prices?.gold;
  const silver = prices?.silver;

  const firstLoad = loading && !prices;

  const rates = {
    gold24: gold?.price_gram_24k,
    gold22: gold?.price_gram_22k,
    gold18: gold?.price_gram_18k,
    silver: silver?.result,
  };

  const updatedAt = gold?.timestamp
    ? new Date(gold.timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      })
    : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF8F3] text-[#29251E] selection:bg-amber-200">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/20 blur-[100px] sm:h-[500px] sm:w-[500px]" />

      <div className="pointer-events-none absolute right-0 top-[650px] h-72 w-72 rounded-full bg-orange-200/20 blur-[100px]" />

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <Analytics />
        <Header onRefresh={getPrices} loading={loading} updatedAt={updatedAt} />

        {/* Hero section */}
        <section className="relative mb-8 mt-8 overflow-hidden rounded-[28px] border border-amber-200/60 bg-gradient-to-br from-white via-[#FFFCF5] to-[#F8EDD5] p-6 shadow-sm sm:mb-10 sm:mt-10 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-amber-300/30 sm:h-80 sm:w-80" />

          <div className="pointer-events-none absolute -right-8 top-10 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl sm:h-64 sm:w-64" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 shadow-sm sm:text-xs">
              <Sparkles size={14} />
              Precious Metals Tracker
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
              Gold &amp; Silver
              <span className="mt-1 block bg-gradient-to-r from-[#E9B949] via-[#B8860B] to-[#79500B] bg-clip-text text-transparent">
                Price Today.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
              Track precious metal prices in Indian rupees. Compare gold purity,
              explore price movements, and estimate the cost of your next
              purchase.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={getPrices}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#332515] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-950/10 transition hover:-translate-y-0.5 hover:bg-[#4A351D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Updating..." : "Refresh prices"}
              </button>

              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200/70 bg-white/70 px-4 py-3 text-xs font-medium text-stone-600">
                <ShieldCheck size={16} className="text-emerald-700" />
                Prices in INR per gram
              </div>
            </div>

            {updatedAt && (
              <p className="mt-5 text-xs text-stone-500">
                Last provider update: {updatedAt}
              </p>
            )}
          </div>

          <div className="pointer-events-none absolute bottom-5 right-8 hidden select-none items-center justify-center sm:flex lg:bottom-8 lg:right-14">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-amber-300/50 bg-white/40 shadow-[0_20px_80px_rgba(184,134,11,0.12)] backdrop-blur-sm lg:h-48 lg:w-48">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700 shadow-inner lg:h-32 lg:w-32">
                <Coins
                  size={60}
                  strokeWidth={1.1}
                  className="text-amber-950/80 lg:hidden"
                />
                <Coins
                  size={82}
                  strokeWidth={1.1}
                  className="hidden text-amber-950/80 lg:block"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertTriangle size={19} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-bold">Unable to update prices</p>
              <p className="mt-1">{error}</p>

              <button
                type="button"
                onClick={getPrices}
                disabled={loading}
                className="mt-3 font-bold underline underline-offset-4 disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Price cards */}
        <section aria-label="Current metal prices">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                Live market overview
              </p>

              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Today's Metal Rates
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Compare rates by purity and metal type.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {loading
                ? "Updating data"
                : error
                  ? "Update failed"
                  : prices
                    ? "Data loaded"
                    : "Waiting for data"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <PriceCard
              title="24K Gold"
              subtitle="Pure gold · per gram"
              icon={<Coins size={20} />}
              price={formatPrice(gold?.price_gram_24k)}
              loading={firstLoad}
              featured
            />

            <PriceCard
              title="22K Gold"
              subtitle="Jewellery gold · per gram"
              icon={<Coins size={20} />}
              price={formatPrice(gold?.price_gram_22k)}
              loading={firstLoad}
            />

            <PriceCard
              title="18K Gold"
              subtitle="Gold alloy · per gram"
              icon={<Coins size={20} />}
              price={formatPrice(gold?.price_gram_18k)}
              loading={firstLoad}
            />

            <PriceCard
              title="Silver"
              subtitle="Silver · per gram"
              icon={<CircleDollarSign size={20} />}
              price={formatPrice(silver?.result)}
              loading={firstLoad}
              accent="silver"
            />
          </div>
        </section>

        {/* Calculator and market analysis */}
        <section
          aria-label="Price calculator and market analysis"
          className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-start"
        >
          <div className="min-w-0 space-y-6 lg:col-span-5">
            <PriceCalculator rates={rates} />

            <GoldHistorySummary refreshKey={refreshKey} />

            <PriceChange refreshKey={refreshKey} />
          </div>

          <div className="min-w-0 space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                  Market history
                </p>

                <h2 className="mt-1 text-xl font-extrabold">
                  Gold Price Trends
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Review historical gold price movements to understand changes
                  over time.
                </p>
              </div>

              <GoldHistoryChart refreshKey={refreshKey} />
            </div>

            <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-[#FFFDF7] to-[#F9F0DE] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold">
                    Understanding metal prices
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Gold and silver prices can change with global markets,
                    currency movements, and local demand. Jewellery bills may
                    also include GST, making charges, and other fees. Use the
                    calculator for estimates, not a final shop quote.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data source */}
        <section className="mt-10 rounded-2xl border border-stone-200 bg-white/80 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold">About these prices</h2>

              <p className="mt-2 text-xs leading-6 text-stone-500 sm:text-sm">
                Price data provided by{" "}
                <a
                  href="https://goldprice.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-800 underline-offset-4 hover:underline"
                >
                  goldprice.dev
                </a>
                . Rates may differ from local jewellery-market prices. Actual
                costs depend on location, taxes, making charges, purity
                verification, and dealer pricing. Calculator results are
                estimates only.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default App;
