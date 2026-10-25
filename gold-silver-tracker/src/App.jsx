import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Coins,
  CircleDollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import Header from "./components/Header";
import PriceCard from "./components/PriceCard";
import GoldHistoryChart from "./components/GoldHistoryChart";
import PriceCalculator from "./components/PriceCalculator";
import GoldHistorySummary from "./components/GoldHistorySummary";
import PriceChange from "./components/PriceChange";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import SeoContent from "./components/Seocontent";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
          : "Unable to load prices. Please check your backend connection.",
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#FFFCF5] text-[#2B2013]">
      {firstLoad && <Loader />}

      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-200/60 blur-3xl sm:h-[34rem] sm:w-[34rem]" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 rounded-full bg-yellow-100 blur-3xl" />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Header (contains the Refresh button) */}
        <Header onRefresh={getPrices} loading={loading} updatedAt={updatedAt} />

        {/* Hero section */}
        <section className="mb-8 mt-2 sm:mb-10 sm:mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700 shadow-sm sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Precious Metals
          </span>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
            Gold & Silver{" "}
            <span className="bg-gradient-to-r from-[#E6B422] via-[#B8860B] to-[#7A5200] bg-clip-text text-transparent">
              Price Today
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Check gold and silver prices in Indian rupees per gram. Compare 24K,
            22K and 18K gold, explore historical prices, and calculate estimated
            metal costs.
          </p>

          {updatedAt && (
            <p className="mt-4 text-xs text-stone-500">
              Provider timestamp: {updatedAt}
            </p>
          )}
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">Unable to update prices</p>

              <p className="mt-1">{error}</p>

              <button
                type="button"
                onClick={getPrices}
                disabled={loading}
                className="mt-2 font-semibold underline underline-offset-4 disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Price cards */}
        <section
          aria-label="Gold and silver prices per gram"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
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
        </section>

        {/* Calculator and historical data */}
        <section
          aria-label="Price calculator and historical gold prices"
          className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-12 lg:items-start"
        >
          {/* Left column */}
          <div className="min-w-0 space-y-6 lg:col-span-5">
            <PriceCalculator rates={rates} />

            <GoldHistorySummary refreshKey={refreshKey} />

            <PriceChange refreshKey={refreshKey} />
          </div>

          {/* Right column */}
          <div className="min-w-0 space-y-6 lg:col-span-7">
            <GoldHistoryChart refreshKey={refreshKey} />

            <SeoContent />
          </div>
        </section>

        {/* Price information disclaimer */}
        <section className="mt-8 rounded-2xl border border-amber-200/80 bg-white/70 p-4">
          <div className="flex items-start gap-3">
            <TrendingUp size={20} className="mt-0.5 shrink-0 text-amber-700" />

            <div>
              <h2 className="text-sm font-bold">About these prices</h2>

              <p className="mt-1 text-xs leading-5 text-stone-500 sm:text-sm">
                Price data by{" "}
                <a
                  href="https://goldprice.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-700 underline-offset-2 hover:underline"
                >
                  goldprice.dev
                </a>
                . Prices may not represent the latest local jewellery-market
                rates. Actual purchase prices can vary by location, taxes,
                making charges, purity verification, and dealer. Calculator
                results are estimates only.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default App;
