import { TrendingDown, TrendingUp, Minus } from "lucide-react";

function PriceChange({ change, percent }) {
  if (change == null || percent == null) {
    return <span className="text-xs text-stone-400">Change unavailable</span>;
  }

  const positive = change > 0;
  const negative = change < 0;

  const Icon = positive ? TrendingUp : negative ? TrendingDown : Minus;

  const color = positive
    ? "text-emerald-700 bg-emerald-50"
    : negative
      ? "text-red-600 bg-red-50"
      : "text-stone-500 bg-stone-100";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      <Icon size={14} />
      {positive ? "+" : ""}
      {Number(percent).toFixed(2)}%
    </span>
  );
}

export default PriceChange;
