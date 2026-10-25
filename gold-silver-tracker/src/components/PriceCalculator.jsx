import { useState } from "react";
import { Calculator } from "lucide-react";

const METALS = [
  { key: "gold24", label: "24K Gold" },
  { key: "gold22", label: "22K Gold" },
  { key: "gold18", label: "18K Gold" },
  { key: "silver", label: "Silver" },
];

const QUICK_GRAMS = [1, 5, 10, 50, 100];

function formatINR(value) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function PriceCalculator({ rates }) {
  const [metal, setMetal] = useState("gold24");
  const [grams, setGrams] = useState("10");

  const rate = Number(rates?.[metal]);
  const weight = Number(grams);

  const hasRate = Number.isFinite(rate) && rate > 0;
  const hasWeight =
    grams.trim() !== "" && Number.isFinite(weight) && weight > 0;

  const total = hasRate && hasWeight ? rate * weight : null;
  const selectedMetal = METALS.find((item) => item.key === metal);

  return (
    <section className="rounded-3xl border border-amber-200/70 bg-white p-5 shadow-xl shadow-amber-900/5 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 text-stone-900 shadow-md shadow-amber-500/30">
          <Calculator size={22} />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Calculator
          </p>
          <h3 className="bg-gradient-to-r from-[#E6B422] via-[#B8860B] to-[#7A5200] bg-clip-text text-xl font-extrabold text-transparent">
            Price by weight
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1 sm:grid-cols-4">
        {METALS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setMetal(item.key)}
            aria-pressed={metal === item.key}
            className={`rounded-lg px-2 py-2 text-sm font-medium transition ${
              metal === item.key
                ? "bg-white text-amber-700 shadow-sm ring-1 ring-amber-200"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label
          htmlFor="calc-grams"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Weight in grams
        </label>

        <div className="relative">
          <input
            id="calc-grams"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="any"
            value={grams}
            onChange={(event) => setGrams(event.target.value)}
            placeholder="Enter weight"
            className="w-full rounded-2xl border border-stone-200 bg-white py-4 pl-5 pr-16 text-2xl font-bold text-stone-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />

          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-lg font-semibold text-stone-400">
            g
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_GRAMS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setGrams(String(value))}
              aria-pressed={weight === value}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                weight === value
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              {value} g
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-stone-50 p-3">
        <span className="text-sm text-stone-600">
          {selectedMetal?.label} rate
        </span>

        <span className="font-bold text-stone-800">
          {hasRate ? `${formatINR(rate)} / g` : "Unavailable"}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 p-5 text-stone-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-800/80">
          Estimated total
        </p>

        {!hasRate ? (
          <p className="mt-2 text-sm font-medium">
            Price unavailable. Refresh the market rates.
          </p>
        ) : !hasWeight ? (
          <p className="mt-2 text-sm font-medium">
            Enter a weight greater than zero.
          </p>
        ) : (
          <>
            <p className="mt-2 break-words text-3xl font-extrabold tracking-tight sm:text-4xl">
              {formatINR(total)}
            </p>

            <p className="mt-2 text-sm text-stone-800/80">
              {weight.toLocaleString("en-IN", {
                maximumFractionDigits: 3,
              })}{" "}
              g × {formatINR(rate)} / g
            </p>
          </>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        Calculated using the retrieved spot rate. This is an estimate, not a
        jeweller's quotation. Retail prices may include GST, making charges, and
        other applicable costs.
      </p>
    </section>
  );
}

export default PriceCalculator;
